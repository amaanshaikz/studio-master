-- Update migration for user_profiles changes
-- Run this after the original supabase-user-profiles-migration.sql if already applied

-- Add new columns if they don't exist
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS focus_improvement TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS ai_boundaries TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS career_study_goals TEXT[];
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS career_study_goals_notes TEXT;

-- Ensure existing columns exist (no-ops if they already do)
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS work_challenges TEXT;

-- Drop obsolete columns if they exist
ALTER TABLE user_profiles DROP COLUMN IF EXISTS strengths;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS improvements;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS goals_short_term;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS goals_long_term;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS goals_now;

-- Optional: reindex not necessary here, but indexes remain valid

-- Note: Existing RLS policies remain unchanged.
