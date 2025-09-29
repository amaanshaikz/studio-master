-- Add user_id field to creatorsprofile table to link with users
-- This migration adds the user relationship to the creatorsprofile table

-- Add user_id column to creatorsprofile table
ALTER TABLE creatorsprofile 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for user_id for better query performance
CREATE INDEX IF NOT EXISTS idx_creatorsprofile_user_id ON creatorsprofile(user_id);

-- Update RLS policies to include user_id relationship
DROP POLICY IF EXISTS "Users can view their own creator profiles" ON creatorsprofile;
DROP POLICY IF EXISTS "Users can insert their own creator profiles" ON creatorsprofile;
DROP POLICY IF EXISTS "Users can update their own creator profiles" ON creatorsprofile;
DROP POLICY IF EXISTS "Users can delete their own creator profiles" ON creatorsprofile;

-- Create new RLS policies that use user_id
CREATE POLICY "Users can view their own creator profiles" ON creatorsprofile
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own creator profiles" ON creatorsprofile
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own creator profiles" ON creatorsprofile
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own creator profiles" ON creatorsprofile
    FOR DELETE USING (auth.uid() = user_id);

-- Add comment to document the relationship
COMMENT ON COLUMN creatorsprofile.user_id IS 'Links the creator profile to the authenticated user who owns it';
