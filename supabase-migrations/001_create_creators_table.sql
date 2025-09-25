-- Create creatorsprofile table for Instagram Creator Intelligence
CREATE TABLE IF NOT EXISTS creatorsprofile (
    id bigserial primary key,
    username text not null unique,
    full_name text,
    follower_count bigint,
    post_count bigint,
    bio text,

    -- Niche
    primary_niche text,
    sub_niches jsonb,  -- array of strings

    -- Brand Style
    visual_aesthetics text,
    tone_of_voice text,
    recurring_motifs text,

    -- Content Making Style
    storytelling_patterns text,
    editing_techniques text,
    performance_elements text,

    -- Content Format & Context
    format_type text,
    typical_context text,

    -- Engagement
    overall_engagement_rate text,

    -- Views & Likes
    average_views_status text,
    average_likes_proxy text,

    -- Viral Content
    viral_post_description text,
    viral_post_likes bigint,
    viral_post_comments bigint,
    viral_post_impact text,

    -- Audience
    target_demographics text,
    target_interests text,
    actual_demographics text,
    audience_evidence text,
    audience_alignment text,
    audience_summary text,

    -- Nested Data
    key_content_themes jsonb,              -- array of {theme, description}
    representative_content_examples jsonb, -- array of {content_type, caption, theme}
    key_hashtags jsonb,                    -- array of {hashtag, category}

    -- Raw Fallback JSON
    raw_json jsonb,

    created_at timestamp default now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_creatorsprofile_username ON creatorsprofile(username);
CREATE INDEX IF NOT EXISTS idx_creatorsprofile_created_at ON creatorsprofile(created_at);
CREATE INDEX IF NOT EXISTS idx_creatorsprofile_primary_niche ON creatorsprofile(primary_niche);
CREATE INDEX IF NOT EXISTS idx_creatorsprofile_follower_count ON creatorsprofile(follower_count);

-- Create GIN indexes for JSONB columns
CREATE INDEX IF NOT EXISTS idx_creatorsprofile_sub_niches ON creatorsprofile USING GIN(sub_niches);
CREATE INDEX IF NOT EXISTS idx_creatorsprofile_key_content_themes ON creatorsprofile USING GIN(key_content_themes);
CREATE INDEX IF NOT EXISTS idx_creatorsprofile_representative_content ON creatorsprofile USING GIN(representative_content_examples);
CREATE INDEX IF NOT EXISTS idx_creatorsprofile_key_hashtags ON creatorsprofile USING GIN(key_hashtags);
CREATE INDEX IF NOT EXISTS idx_creatorsprofile_raw_json ON creatorsprofile USING GIN(raw_json);

-- Add RLS (Row Level Security) policies
ALTER TABLE creatorsprofile ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to see their own creator profiles
CREATE POLICY "Users can view their own creator profiles" ON creatorsprofile
    FOR SELECT USING (true);

-- Policy to allow users to insert their own creator profiles
CREATE POLICY "Users can insert their own creator profiles" ON creatorsprofile
    FOR INSERT WITH CHECK (true);

-- Policy to allow users to update their own creator profiles
CREATE POLICY "Users can update their own creator profiles" ON creatorsprofile
    FOR UPDATE USING (true);

-- Policy to allow users to delete their own creator profiles
CREATE POLICY "Users can delete their own creator profiles" ON creatorsprofile
    FOR DELETE USING (true);
