-- Creator Profile Setup Migration
-- Run this in your Supabase SQL Editor

-- Drop existing table if it exists (for clean migration)
DROP TABLE IF EXISTS creators CASCADE;

-- Create creators table for the new 15-question onboarding form
CREATE TABLE IF NOT EXISTS creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- SECTION 1: CREATOR PROFILE & BRAND
  full_name VARCHAR(255),
  age INTEGER,
  location VARCHAR(255),
  primary_language VARCHAR(100),
  
  platforms TEXT[], -- Multi-select: YouTube, Instagram, TikTok, LinkedIn, Blog, Podcast, Other
  main_focus_platform VARCHAR(100),
  other_platforms TEXT,
  
  primary_niche VARCHAR(100), -- Dropdown: Fitness, Technology, Education, etc.
  sub_niche VARCHAR(255),
  target_audience TEXT[], -- Multi-select: Gen Z, Millennials, etc.
  other_niche VARCHAR(255),
  other_target_audience TEXT,
  
  brand_words VARCHAR(255), -- 3-5 word tags
  tone_style VARCHAR(100), -- Dropdown: Casual, Professional, etc.
  
  total_followers INTEGER,
  average_views INTEGER,
  
  -- SECTION 2: CONTENT STYLE & CREATIVE DIRECTION
  content_formats TEXT[], -- Multi-select: Short-form video, Long-form video, etc.
  typical_length_number INTEGER,
  typical_length_unit VARCHAR(20), -- seconds/minutes
  other_formats TEXT,
  
  on_camera VARCHAR(20), -- Radio: Yes/No/Sometimes
  use_voiceovers VARCHAR(10), -- Radio: Yes/No
  editing_music_style TEXT,
  
  short_term_goals TEXT,
  long_term_goals TEXT,
  
  posting_frequency INTEGER, -- posts/videos per week
  posting_schedule VARCHAR(50), -- Dropdown: Daily, Multiple times/week, etc.
  
  biggest_challenge TEXT,
  
  -- SECTION 3: GROWTH, MONETIZATION & AI PERSONALIZATION
  strengths TEXT,
  weaknesses TEXT,
  
  income_streams TEXT[], -- Multi-select: Sponsorships, Affiliate marketing, etc.
  brand_types_to_avoid TEXT,
  
  ai_help_preferences TEXT[], -- Multi-select: Content ideas, Trends, etc.
  
  niche_focus VARCHAR(50), -- Radio: Strictly niche / Niche + Related trends / Open to all trending topics
  content_style VARCHAR(20), -- Radio: Conservative / Balanced / Experimental
  
  non_negotiable_rules TEXT,
  
  -- Setup Status
  is_setup_complete BOOLEAN DEFAULT FALSE,
  current_step INTEGER DEFAULT 1,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS creators_user_id_idx ON creators(user_id);
CREATE INDEX IF NOT EXISTS creators_setup_complete_idx ON creators(is_setup_complete);
CREATE INDEX IF NOT EXISTS creators_primary_niche_idx ON creators(primary_niche);
CREATE INDEX IF NOT EXISTS creators_platforms_idx ON creators USING GIN(platforms);

-- Enable Row Level Security
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own creator profile" ON creators;
DROP POLICY IF EXISTS "Users can update own creator profile" ON creators;
DROP POLICY IF EXISTS "Users can insert own creator profile" ON creators;
DROP POLICY IF EXISTS "Service role can access all creator profiles" ON creators;

-- Create RLS policies for NextAuth compatibility
-- Users can view their own creator profile
CREATE POLICY "Users can view own creator profile" ON creators
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM users WHERE id = user_id
    )
  );

-- Users can update their own creator profile
CREATE POLICY "Users can update own creator profile" ON creators
  FOR UPDATE USING (
    user_id IN (
      SELECT id FROM users WHERE id = user_id
    )
  );

-- Users can insert their own creator profile
CREATE POLICY "Users can insert own creator profile" ON creators
  FOR INSERT WITH CHECK (
    user_id IN (
      SELECT id FROM users WHERE id = user_id
    )
  );

-- Allow service role to access all data (for NextAuth API routes)
CREATE POLICY "Service role can access all creator profiles" ON creators
  FOR ALL USING (auth.role() = 'service_role');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_creators_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_creators_updated_at ON creators;
CREATE TRIGGER update_creators_updated_at 
    BEFORE UPDATE ON creators 
    FOR EACH ROW 
    EXECUTE FUNCTION update_creators_updated_at_column();
