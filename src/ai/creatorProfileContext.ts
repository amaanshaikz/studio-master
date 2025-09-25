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

// Instagram Creator Intelligence Profile Type (from creatorsprofile table)
export type InstagramCreatorProfileRow = {
  id: number;
  user_id: string | null;  // Links to auth.users(id)
  username: string;
  instagram_url: string;
  full_name: string | null;
  follower_count: number | null;
  post_count: number | null;
  bio: string | null;
  
  // Niche
  primary_niche: string | null;
  sub_niches: any | null; // JSONB array of strings
  
  // Brand Style
  visual_aesthetics: string | null;
  tone_of_voice: string | null;
  recurring_motifs: string | null;
  
  // Content Making Style
  storytelling_patterns: string | null;
  editing_techniques: string | null;
  performance_elements: string | null;
  
  // Content Format & Context
  format_type: string | null;
  typical_context: string | null;
  
  // Engagement
  overall_engagement_rate: string | null;
  
  // Views & Likes
  average_views_status: string | null;
  average_likes_proxy: string | null;
  
  // Viral Content
  viral_post_description: string | null;
  viral_post_likes: number | null;
  viral_post_comments: number | null;
  viral_post_impact: string | null;
  
  // Audience
  target_demographics: string | null;
  target_interests: string | null;
  actual_demographics: string | null;
  audience_evidence: string | null;
  audience_alignment: string | null;
  audience_summary: string | null;
  
  // Nested Data
  key_content_themes: any | null; // JSONB array of {theme, description}
  representative_content_examples: any | null; // JSONB array of {content_type, caption, theme}
  key_hashtags: any | null; // JSONB array of {hashtag, category}
  
  // Raw Fallback JSON
  raw_json: any | null;
  
  created_at: string | null;
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
 * Helper function to format JSONB array fields
 */
function formatJsonbArray(array: any | null | undefined): string {
  if (!array || !Array.isArray(array) || array.length === 0) return '-';
  return array.map(item => {
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && item !== null) {
      return Object.entries(item).map(([key, value]) => `${key}: ${value}`).join(', ');
    }
    return String(item);
  }).join('; ');
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
 * Builds Instagram Creator Intelligence profile context from creatorsprofile table
 * This provides deep insights from Parallel AI analysis for enhanced personalization
 */
export async function buildInstagramCreatorIntelligenceContext(username?: string): Promise<string> {
  try {
    console.log('🔍 [CREATOR INTELLIGENCE] Building Instagram Creator Intelligence context');
    
    // Get current user session
    const session = await auth();
    if (!session?.user?.id) {
      console.log('❌ [CREATOR INTELLIGENCE] No authenticated user found');
      return "Instagram Creator Intelligence profile unavailable. Please log in to access your creator profile.";
    }
    
    // Check cache first
    const cacheKey = `instagram_${session.user.id}_${username || 'current'}`;
    const cached = profileCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('✅ [CREATOR INTELLIGENCE] Using cached profile');
      return cached.profile;
    }

    // Fetch Instagram Creator Intelligence profile from creatorsprofile table
    let query = supabase.from('creatorsprofile').select('*');
    
    if (username) {
      // If specific username is requested, find by username and user_id
      query = query.eq('username', username).eq('user_id', session.user.id);
    } else {
      // For current user, get their most recent Instagram profile
      query = query.eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(1);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      console.log('❌ [CREATOR INTELLIGENCE] No Instagram Creator Intelligence profile found');
      const fallbackProfile = "Instagram Creator Intelligence profile unavailable. This creator hasn't completed Instagram profile analysis yet.";
      profileCache.set(cacheKey, { profile: fallbackProfile, timestamp: Date.now() });
      return fallbackProfile;
    }

    const profile = data as InstagramCreatorProfileRow;
    console.log('✅ [CREATOR INTELLIGENCE] Found Instagram profile for:', profile.username);

    // Format the Instagram Creator Intelligence profile
    const formattedProfile = `🎯 INSTAGRAM CREATOR INTELLIGENCE PROFILE
Generated by Parallel AI Deep Research Analysis

=== BASIC PROFILE ===
Username: @${profile.username}
Full Name: ${formatField(profile.full_name)}
Instagram URL: ${formatField(profile.instagram_url)}
Bio: ${formatField(profile.bio)}
Followers: ${formatField(profile.follower_count?.toLocaleString())}
Posts: ${formatField(profile.post_count)}

=== NICHE & BRAND ANALYSIS ===
Primary Niche: ${formatField(profile.primary_niche)}
Sub-Niches: ${formatJsonbArray(profile.sub_niches)}
Visual Aesthetics: ${formatField(profile.visual_aesthetics)}
Tone of Voice: ${formatField(profile.tone_of_voice)}
Recurring Motifs: ${formatField(profile.recurring_motifs)}

=== CONTENT CREATION STYLE ===
Storytelling Patterns: ${formatField(profile.storytelling_patterns)}
Editing Techniques: ${formatField(profile.editing_techniques)}
Performance Elements: ${formatField(profile.performance_elements)}
Format Type: ${formatField(profile.format_type)}
Typical Context: ${formatField(profile.typical_context)}

=== ENGAGEMENT & PERFORMANCE ===
Overall Engagement Rate: ${formatField(profile.overall_engagement_rate)}
Average Views Status: ${formatField(profile.average_views_status)}
Average Likes Proxy: ${formatField(profile.average_likes_proxy)}

=== VIRAL CONTENT ANALYSIS ===
Viral Post Description: ${formatField(profile.viral_post_description)}
Viral Post Likes: ${formatField(profile.viral_post_likes?.toLocaleString())}
Viral Post Comments: ${formatField(profile.viral_post_comments?.toLocaleString())}
Viral Post Impact: ${formatField(profile.viral_post_impact)}

=== AUDIENCE INTELLIGENCE ===
Target Demographics: ${formatField(profile.target_demographics)}
Target Interests: ${formatField(profile.target_interests)}
Actual Demographics: ${formatField(profile.actual_demographics)}
Audience Evidence: ${formatField(profile.audience_evidence)}
Audience Alignment: ${formatField(profile.audience_alignment)}
Audience Summary: ${formatField(profile.audience_summary)}

=== CONTENT THEMES & EXAMPLES ===
Key Content Themes: ${formatJsonbArray(profile.key_content_themes)}
Representative Content Examples: ${formatJsonbArray(profile.representative_content_examples)}
Key Hashtags: ${formatJsonbArray(profile.key_hashtags)}

=== ANALYSIS METADATA ===
Analysis Date: ${formatField(profile.created_at)}
Data Source: Parallel AI Deep Research (Instagram Profile Analysis)

---
CRITICAL: Use this intelligence data to provide highly personalized content suggestions, engagement strategies, and growth recommendations that align with this creator's proven content patterns, audience preferences, and performance history.`;

    // Cache the formatted profile
    profileCache.set(cacheKey, { profile: formattedProfile, timestamp: Date.now() });
    console.log('✅ [CREATOR INTELLIGENCE] Profile context built and cached');

    return formattedProfile;

  } catch (error) {
    console.error('❌ [CREATOR INTELLIGENCE] Error building Instagram Creator Intelligence context:', error);
    return "Instagram Creator Intelligence profile unavailable due to technical error.";
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

