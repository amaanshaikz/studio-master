-- Platform Integrations Database Schema
-- This migration adds tables for Instagram Graph API and LinkedIn API data storage

-- Platform connections table
CREATE TABLE IF NOT EXISTS platform_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL CHECK (platform IN ('instagram', 'linkedin')),
  platform_user_id VARCHAR(255) NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  profile_data JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

-- Webhook events table
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(50) NOT NULL CHECK (platform IN ('instagram', 'linkedin')),
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Instagram specific data table
CREATE TABLE IF NOT EXISTS instagram_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  connection_id UUID NOT NULL REFERENCES platform_connections(id) ON DELETE CASCADE,
  instagram_user_id VARCHAR(255) NOT NULL,
  username VARCHAR(255),
  full_name VARCHAR(255),
  bio TEXT,
  profile_picture_url TEXT,
  website VARCHAR(500),
  media_count INTEGER DEFAULT 0,
  follower_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  account_type VARCHAR(50),
  is_private BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  business_category_name VARCHAR(255),
  category_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, instagram_user_id)
);

-- LinkedIn specific data table
CREATE TABLE IF NOT EXISTS linkedin_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  connection_id UUID NOT NULL REFERENCES platform_connections(id) ON DELETE CASCADE,
  linkedin_user_id VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255),
  profile_picture_url TEXT,
  headline VARCHAR(500),
  summary TEXT,
  location VARCHAR(255),
  industry VARCHAR(255),
  connection_count INTEGER DEFAULT 0,
  follower_count INTEGER DEFAULT 0,
  public_profile_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, linkedin_user_id)
);

-- Instagram media table
CREATE TABLE IF NOT EXISTS instagram_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  instagram_data_id UUID NOT NULL REFERENCES instagram_data(id) ON DELETE CASCADE,
  media_id VARCHAR(255) NOT NULL,
  media_type VARCHAR(50) NOT NULL CHECK (media_type IN ('IMAGE', 'VIDEO', 'CAROUSEL_ALBUM')),
  media_url TEXT,
  thumbnail_url TEXT,
  caption TEXT,
  permalink VARCHAR(500),
  timestamp TIMESTAMP WITH TIME ZONE,
  like_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  insights_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(instagram_data_id, media_id)
);

-- LinkedIn posts table
CREATE TABLE IF NOT EXISTS linkedin_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  linkedin_data_id UUID NOT NULL REFERENCES linkedin_data(id) ON DELETE CASCADE,
  post_id VARCHAR(255) NOT NULL,
  content TEXT,
  visibility VARCHAR(50),
  timestamp TIMESTAMP WITH TIME ZONE,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  engagement_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(linkedin_data_id, post_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS platform_connections_user_id_idx ON platform_connections(user_id);
CREATE INDEX IF NOT EXISTS platform_connections_platform_idx ON platform_connections(platform);
CREATE INDEX IF NOT EXISTS platform_connections_platform_user_id_idx ON platform_connections(platform_user_id);
CREATE INDEX IF NOT EXISTS webhook_events_platform_idx ON webhook_events(platform);
CREATE INDEX IF NOT EXISTS webhook_events_event_type_idx ON webhook_events(event_type);
CREATE INDEX IF NOT EXISTS webhook_events_processed_idx ON webhook_events(processed);
CREATE INDEX IF NOT EXISTS instagram_data_user_id_idx ON instagram_data(user_id);
CREATE INDEX IF NOT EXISTS instagram_data_instagram_user_id_idx ON instagram_data(instagram_user_id);
CREATE INDEX IF NOT EXISTS linkedin_data_user_id_idx ON linkedin_data(user_id);
CREATE INDEX IF NOT EXISTS linkedin_data_linkedin_user_id_idx ON linkedin_data(linkedin_user_id);
CREATE INDEX IF NOT EXISTS instagram_media_instagram_data_id_idx ON instagram_media(instagram_data_id);
CREATE INDEX IF NOT EXISTS instagram_media_media_id_idx ON instagram_media(media_id);
CREATE INDEX IF NOT EXISTS linkedin_posts_linkedin_data_id_idx ON linkedin_posts(linkedin_data_id);
CREATE INDEX IF NOT EXISTS linkedin_posts_post_id_idx ON linkedin_posts(post_id);

-- Enable Row Level Security (RLS)
ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE linkedin_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE linkedin_posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only access their own platform data
CREATE POLICY "Users can view own platform connections" ON platform_connections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own platform connections" ON platform_connections
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own platform connections" ON platform_connections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own platform connections" ON platform_connections
  FOR DELETE USING (auth.uid() = user_id);

-- Service role can access all data (for webhooks and background processing)
CREATE POLICY "Service role can access all platform connections" ON platform_connections
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can access all webhook events" ON webhook_events
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can access all instagram data" ON instagram_data
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can access all linkedin data" ON linkedin_data
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can access all instagram media" ON instagram_media
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can access all linkedin posts" ON linkedin_posts
  FOR ALL USING (auth.role() = 'service_role');

-- Users can view their own platform data
CREATE POLICY "Users can view own instagram data" ON instagram_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own linkedin data" ON linkedin_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own instagram media" ON instagram_media
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own linkedin posts" ON linkedin_posts
  FOR SELECT USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_platform_connections_updated_at BEFORE UPDATE ON platform_connections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instagram_data_updated_at BEFORE UPDATE ON instagram_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_linkedin_data_updated_at BEFORE UPDATE ON linkedin_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instagram_media_updated_at BEFORE UPDATE ON instagram_media
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_linkedin_posts_updated_at BEFORE UPDATE ON linkedin_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
