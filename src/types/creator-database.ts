// Database record types for the creators table
// These match the actual database columns

export interface CreatorDatabaseRecord {
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
  sub_niches: string[] | null;  // stored as JSONB

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
  key_content_themes: any[] | null;              // array of {theme, description}
  representative_content_examples: any[] | null; // array of {content_type, caption, theme}
  key_hashtags: any[] | null;                    // array of {hashtag, category}

  // Raw Fallback JSON
  raw_json: any | null;

  created_at: string;
}

// Helper type for creating a new creator record (without id and timestamps)
export type CreateCreatorRecord = Omit<CreatorDatabaseRecord, 'id' | 'created_at'>;

// Helper type for updating a creator record (without id and timestamps)
export type UpdateCreatorRecord = Partial<Omit<CreatorDatabaseRecord, 'id' | 'created_at' | 'updated_at'>>;
