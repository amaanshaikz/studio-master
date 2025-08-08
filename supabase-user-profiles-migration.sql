-- Create user_profiles table for multi-step setup form
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Basic Information
  full_name VARCHAR(255),
  nickname VARCHAR(100),
  age INTEGER,
  pronouns VARCHAR(50),
  location VARCHAR(255),
  timezone VARCHAR(100),
  languages TEXT[],
  communication_style VARCHAR(50),
  
  -- Personal Insights
  strengths TEXT[],
  improvements TEXT[],
  motivation VARCHAR(50),
  personality_type VARCHAR(20),
  productive_time VARCHAR(20),
  productivity_systems TEXT[],
  
  -- Professional Profile (Optional)
  profession VARCHAR(100),
  goals_short_term TEXT,
  goals_long_term TEXT,
  tools_used TEXT[],
  work_challenges TEXT,
  ai_support_preference TEXT[],
  
  -- Setup Status
  is_setup_complete BOOLEAN DEFAULT FALSE,
  current_step INTEGER DEFAULT 1,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS user_profiles_user_id_idx ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS user_profiles_setup_complete_idx ON user_profiles(is_setup_complete);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow service role to access all data (for NextAuth)
CREATE POLICY "Service role can access all user profiles" ON user_profiles
  FOR ALL USING (auth.role() = 'service_role');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
