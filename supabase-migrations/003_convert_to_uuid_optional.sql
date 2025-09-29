-- OPTIONAL: Convert creatorsprofile table to use UUID instead of bigserial
-- Only run this if you want UUID benefits for your specific use case

-- Step 1: Add new UUID column
ALTER TABLE creatorsprofile 
ADD COLUMN new_id uuid DEFAULT gen_random_uuid();

-- Step 2: Update any foreign key references (if they exist)
-- Note: This would need to be done for any tables that reference creatorsprofile.id

-- Step 3: Drop the old primary key constraint
ALTER TABLE creatorsprofile DROP CONSTRAINT creatorsprofile_pkey;

-- Step 4: Drop the old id column
ALTER TABLE creatorsprofile DROP COLUMN id;

-- Step 5: Rename new_id to id and make it primary key
ALTER TABLE creatorsprofile RENAME COLUMN new_id TO id;
ALTER TABLE creatorsprofile ADD PRIMARY KEY (id);

-- Step 6: Update indexes to use UUID
DROP INDEX IF EXISTS idx_creatorsprofile_username;
CREATE INDEX idx_creatorsprofile_username ON creatorsprofile(username);

-- Step 7: Update TypeScript types to use string instead of number
-- In src/types/creator-database.ts:
-- Change: id: number;
-- To:     id: string;

-- Step 8: Update any application code that expects numeric IDs
-- Search for: creatorsprofile.id
-- Replace with: creatorsprofile.id (but handle as string)

-- WARNING: This migration will break existing data relationships
-- Only proceed if you understand the implications
