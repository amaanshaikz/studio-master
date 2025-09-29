// Instagram Creator Intelligence Types
// Based on new Parallel API response schema

export interface KeyContentTheme {
  theme: string;
  description: string;
}

export interface RepresentativeContentExample {
  content_type: string;
  title_or_caption: string;
  theme: string;
}

export interface KeyHashtag {
  hashtag: string;
  category: string;
}

export interface CreatorIntelligenceData {
  username: string;
  full_name: string;
  follower_count: number;
  post_count: number;
  bio: string;

  primary_niche: string;
  sub_niches: string[];

  visual_aesthetics: string;
  tone_of_voice: string;
  recurring_motifs: string;

  storytelling_patterns: string;
  editing_techniques: string;
  performance_elements: string;

  format_type: string;
  typical_context: string;

  overall_engagement_rate: string;

  average_views_status: string;
  average_likes_proxy: string;
  data_limitation_note: string;

  viral_post_description: string;
  viral_post_likes: number;
  viral_post_comments: number;
  viral_post_impact: string;

  target_demographics: string;
  target_interests: string;
  actual_demographics: string;
  audience_evidence: string;
  audience_alignment: string;
  audience_summary: string;

  key_content_themes: KeyContentTheme[];
  representative_content_examples: RepresentativeContentExample[];
  key_hashtags: KeyHashtag[];
}

export interface CreatorRecord {
  id: string;
  instagram_url: string;
  data: CreatorIntelligenceData;
  created_at: string;
  updated_at: string;
}

// API Request/Response Types
export interface RunInstagramTaskRequest {
  instagram_url: string;
}

export interface RunInstagramTaskResponse {
  status: 'success' | 'error' | 'queued' | 'running';
  message?: string;
  task_id?: string;
  creator_id?: string;
}

export interface TaskStatusResponse {
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress?: number;
  message?: string;
  result?: CreatorIntelligenceData;
}
