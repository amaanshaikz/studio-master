export interface CreatorData {
  // Database fields
  id?: string;
  user_id?: string;
  
  // SECTION 1: CREATOR PROFILE & BRAND
  full_name?: string;
  age?: number;
  location?: string;
  primary_language?: string;
  
  platforms?: string[];
  main_focus_platform?: string;
  other_platforms?: string;
  
  primary_niche?: string; // Allow any string for custom niches
  sub_niche?: string;
  target_audience?: string[];
  other_niche?: string;
  other_target_audience?: string;
  
  brand_words?: string;
  tone_style?: string;
  
  total_followers?: number;
  average_views?: number;
  
  // SECTION 2: CONTENT STYLE & CREATIVE DIRECTION
  content_formats?: string[];
  typical_length_number?: number;
  typical_length_unit?: string;
  other_formats?: string;
  
  on_camera?: string;
  use_voiceovers?: string;
  editing_music_style?: string;
  
  short_term_goals?: string;
  long_term_goals?: string;
  
  posting_frequency?: number;
  posting_schedule?: string;
  
  biggest_challenge?: string;
  
  // SECTION 3: GROWTH, MONETIZATION & AI PERSONALIZATION
  strengths?: string;
  weaknesses?: string;
  
  income_streams?: string[];
  brand_types_to_avoid?: string;
  
  ai_help_preferences?: string[];
  
  niche_focus?: string;
  content_style?: string;
  
  non_negotiable_rules?: string;
  
  // Setup Status
  is_setup_complete?: boolean;
  current_step?: number;
  created_at?: string;
  updated_at?: string;
}

export const PLATFORMS = [
  'YouTube',
  'Instagram', 
  'TikTok',
  'LinkedIn',
  'Blog',
  'Podcast',
  'Other'
] as const;

export const NICHES = [
  'Fitness',
  'Technology',
  'Education',
  'Lifestyle',
  'Fashion',
  'Food',
  'Travel',
  'Gaming',
  'Comedy',
  'Personal Finance',
  'Motivation',
  'Art',
  'Music',
  'Other'
] as const;

// Type for predefined niches plus custom strings
export type NicheType = typeof NICHES[number] | string;

export const TARGET_AUDIENCES = [
  'Gen Z',
  'Millennials',
  'Gen X',
  'Boomers',
  'Students',
  'Working Professionals',
  'Entrepreneurs',
  'Parents',
  'Retirees',
  'Hobbyists',
  'Gamers',
  'Fitness Enthusiasts',
  'Creatives',
  'Tech Enthusiasts',
  'Other'
] as const;

export const TONE_STYLES = [
  'Casual',
  'Professional',
  'Humorous',
  'Inspiring',
  'Informative',
  'Motivational',
  'Other'
] as const;

export const CONTENT_FORMATS = [
  'Short-form video',
  'Long-form video',
  'Carousel posts',
  'Blogs',
  'Podcasts',
  'Livestreams',
  'Other'
] as const;

export const POSTING_SCHEDULES = [
  'Daily',
  'Multiple times/week',
  'Weekly',
  'Other'
] as const;

export const INCOME_STREAMS = [
  'Sponsorships',
  'Affiliate marketing',
  'Ads',
  'Merchandise',
  'Courses',
  'Subscriptions',
  'Other'
] as const;

export const AI_HELP_PREFERENCES = [
  'Content ideas',
  'Trends',
  'Scripts',
  'Captions',
  'Hashtags',
  'Posting times',
  'Growth strategy',
  'Audience engagement',
  'Other'
] as const;

export const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'South Korea',
  'India',
  'Brazil',
  'Mexico',
  'Spain',
  'Italy',
  'Netherlands',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Switzerland',
  'Austria',
  'Belgium',
  'Ireland',
  'New Zealand',
  'Singapore',
  'Hong Kong',
  'Taiwan',
  'Thailand',
  'Vietnam',
  'Philippines',
  'Malaysia',
  'Indonesia',
  'Other'
] as const;

export const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Russian',
  'Japanese',
  'Korean',
  'Chinese (Mandarin)',
  'Chinese (Cantonese)',
  'Arabic',
  'Hindi',
  'Bengali',
  'Urdu',
  'Turkish',
  'Dutch',
  'Swedish',
  'Norwegian',
  'Danish',
  'Finnish',
  'Polish',
  'Czech',
  'Hungarian',
  'Romanian',
  'Bulgarian',
  'Greek',
  'Hebrew',
  'Thai',
  'Vietnamese',
  'Indonesian',
  'Malay',
  'Filipino',
  'Other'
] as const;
