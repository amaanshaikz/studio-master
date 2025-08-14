import { createClient } from '@supabase/supabase-js';
import { auth } from '@/lib/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Cache configuration
const CACHE_TTL = parseInt(process.env.CREATOR_PROFILE_CACHE_TTL || '300000'); // 5 minutes default
const profileCache = new Map<string, { profile: string; timestamp: number }>();

export type CreatorProfileRow = {
  id: string;
  user_id: string;
  
  // SECTION 1: CREATOR PROFILE & BRAND
  full_name: string | null;
  age: number | null;
  location: string | null;
  primary_language: string | null;
  
  platforms: string[] | null;
  main_focus_platform: string | null;
  other_platforms: string | null;
  
  primary_niche: string | null;
  sub_niche: string | null;
  target_audience: string[] | null;
  other_niche: string | null;
  other_target_audience: string | null;
  
  brand_words: string | null;
  tone_style: string | null;
  
  total_followers: number | null;
  average_views: number | null;
  
  // SECTION 2: CONTENT STYLE & CREATIVE DIRECTION
  content_formats: string[] | null;
  typical_length_number: number | null;
  typical_length_unit: string | null;
  other_formats: string | null;
  
  on_camera: string | null;
  use_voiceovers: string | null;
  editing_music_style: string | null;
  
  short_term_goals: string | null;
  long_term_goals: string | null;
  
  posting_frequency: number | null;
  posting_schedule: string | null;
  
  biggest_challenge: string | null;
  
  // SECTION 3: GROWTH, MONETIZATION & AI PERSONALIZATION
  strengths: string | null;
  weaknesses: string | null;
  
  income_streams: string[] | null;
  brand_types_to_avoid: string | null;
  
  ai_help_preferences: string[] | null;
  
  niche_focus: string | null;
  content_style: string | null;
  
  non_negotiable_rules: string | null;
  
  // Setup Status
  is_setup_complete: boolean | null;
  current_step: number | null;
  created_at: string | null;
  updated_at: string | null;
};

/**
 * Helper function to format array fields as comma-separated strings
 */
function formatArrayField(array: string[] | null | undefined): string {
  if (!array || array.length === 0) return '-';
  return array.join(', ');
}

/**
 * Helper function to format nullable fields
 */
function formatField(value: any): string {
  if (value === null || value === undefined || value === '') return '-';
  return String(value).trim();
}

/**
 * Validates that the current user is authorized to access the creator profile
 */
async function validateCreatorAccess(creatorId?: string): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('User not authenticated');
  }

  // If no specific creatorId is provided, use the current user's ID
  if (!creatorId) {
    return session.user.id;
  }

  // For admin flows, validate that the user is authorized to access this creator
  // This is a basic implementation - you may want to add role-based checks
  const { data: creator, error } = await supabase
    .from('creators')
    .select('user_id')
    .eq('id', creatorId)
    .single();

  if (error || !creator) {
    throw new Error('Creator not found');
  }

  // For now, only allow users to access their own profiles
  // You can extend this for admin roles
  if (creator.user_id !== session.user.id) {
    throw new Error('Unauthorized access to creator profile');
  }

  return creator.user_id;
}

/**
 * Builds a formatted creator profile context string from the database
 */
export async function buildCreatorProfileContext(creatorId?: string): Promise<string> {
  try {
    // Validate access and get the user_id to fetch
    const userId = await validateCreatorAccess(creatorId);
    
    // Check cache first
    const cacheKey = creatorId || userId;
    const cached = profileCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.profile;
    }

    // Fetch creator profile from database
    const { data, error } = await supabase
      .from('creators')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      const fallbackProfile = "Creator profile unavailable.";
      // Cache the fallback to avoid repeated DB calls
      profileCache.set(cacheKey, { profile: fallbackProfile, timestamp: Date.now() });
      return fallbackProfile;
    }

    const creator = data as CreatorProfileRow;

    // Format the profile according to the exact template
    const formattedProfile = `Section 1 – Creator Profile & Brand
Full Name: ${formatField(creator.full_name)}
Age: ${formatField(creator.age)}
Location: ${formatField(creator.location)}
Primary Language: ${formatField(creator.primary_language)}
Main Focus Platform: ${formatField(creator.main_focus_platform)}
Other Platforms: ${formatField(creator.other_platforms)}
Niche: ${formatField(creator.primary_niche)}
Target Audience: ${formatArrayField(creator.target_audience)}
Brand Words: ${formatField(creator.brand_words)}
Followers: ${formatField(creator.total_followers)}
Average Views: ${formatField(creator.average_views)}

Section 2 – Content Style & Workflow
Content Formats: ${formatArrayField(creator.content_formats)}
Typical Length & Unit: ${formatField(creator.typical_length_number)} ${formatField(creator.typical_length_unit)}
Inspirations/Competitors: ${formatField(creator.editing_music_style)}
Short-Term Goals (3 months): ${formatField(creator.short_term_goals)}
Long-Term Goals (1–3 years): ${formatField(creator.long_term_goals)}

Section 3 – Growth, Monetization & AI Personalization
Biggest Strengths: ${formatField(creator.strengths)}
Biggest Challenges: ${formatField(creator.biggest_challenge)}
Income Streams: ${formatArrayField(creator.income_streams)}
Brand Types to Avoid: ${formatField(creator.brand_types_to_avoid)}
AI Assistance Preferences: ${formatArrayField(creator.ai_help_preferences)}
Content Exploration Mode: ${formatField(creator.niche_focus)}`;

    // Cache the formatted profile
    profileCache.set(cacheKey, { profile: formattedProfile, timestamp: Date.now() });

    return formattedProfile;

  } catch (error) {
    console.error('Error building creator profile context:', error);
    return "Creator profile unavailable.";
  }
}

/**
 * Invalidates the cache for a specific creator profile
 * Call this when a creator profile is updated
 */
export function invalidateCreatorProfileCache(creatorId?: string): void {
  if (creatorId) {
    profileCache.delete(creatorId);
  } else {
    // Clear all cache if no specific ID provided
    profileCache.clear();
  }
}

/**
 * Gets cache statistics for monitoring
 */
export function getCacheStats(): { size: number; entries: Array<{ key: string; age: number }> } {
  const now = Date.now();
  const entries = Array.from(profileCache.entries()).map(([key, value]) => ({
    key,
    age: now - value.timestamp
  }));

  return {
    size: profileCache.size,
    entries
  };
}

