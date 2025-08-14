# Creator Profile Setup - Implementation Guide

## Overview

This document outlines the new creator profile setup system that replaces the previous onboarding questions with 15 comprehensive questions organized into 3 sections.

## Database Changes

### New Table: `creators`

The new `creators` table stores all creator profile data with the following structure:

```sql
-- Run the migration: supabase-creators-migration.sql
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
```

## API Endpoints

### New API Route: `/api/user/creators/setup`

- **GET**: Fetch existing creator profile data
- **POST**: Create or update creator profile data

## Components Structure

### New Components

1. **`CreatorProfileStep.tsx`** - Section 1: Questions 1-5
   - Basic Information (name, age, location, language)
   - Content Platforms
   - Content Niche & Audience
   - Personal Brand & Style
   - Current Reach

2. **`ContentStyleStep.tsx`** - Section 2: Questions 6-10
   - Content Formats & Length
   - Content Creation Style
   - Content & Monetization Goals
   - Posting Schedule
   - Current Challenges

3. **`GrowthMonetizationStep.tsx`** - Section 3: Questions 11-15
   - Creator Strengths & Weaknesses
   - Monetization & Brand Preferences
   - AI Assistance Preferences
   - Content Strategy Preferences
   - Content Boundaries

### Updated Components

- **`SetupWizard.tsx`** - Main wizard component updated to use new creator components
- **`types/creator.ts`** - TypeScript types and constants for all form fields

## Form Features

### Input Types Used

1. **Text Inputs**: Name, sub-niche, brand words, etc.
2. **Number Inputs**: Age, followers, views, posting frequency, etc.
3. **Dropdowns**: Location, language, niche, tone style, etc.
4. **Multi-select Checkboxes**: Platforms, target audience, content formats, etc.
5. **Radio Buttons**: On camera, voiceovers, niche focus, content style, etc.
6. **Textareas**: Goals, challenges, strengths, weaknesses, etc.

### Validation

- Required fields are marked with asterisks (*)
- Number fields accept only valid integers
- Multi-select fields support adding/removing items
- "Other" options allow custom text input

### UI/UX Features

- Responsive design for mobile and desktop
- Progress indicator showing current step
- Section headers for clear organization
- Badge display for selected multi-select items
- Clean, modern interface with stars background
- Form validation and error handling

## Migration Steps

1. **Run Database Migration**:
   ```bash
   # Execute the SQL migration in your Supabase dashboard
   # or use the supabase CLI
   supabase db push
   ```

2. **Update Environment Variables**:
   Ensure your Supabase environment variables are properly configured.

3. **Test the Setup Flow**:
   - Navigate to `/setup`
   - Complete all 3 sections
   - Verify data is saved to the `creators` table
   - Test edit mode for existing profiles

## Data Flow

1. User navigates to `/setup`
2. SetupWizard loads existing data from `/api/user/creators/setup`
3. User fills out forms in 3 sections
4. Data is saved to Supabase `creators` table
5. On completion, user is redirected to `/profile`

## Future Enhancements

- Add form validation with Zod schemas
- Implement data export functionality
- Add analytics tracking for setup completion rates
- Create admin dashboard for viewing creator profiles
- Add bulk import/export capabilities

## Notes

- The old `user_profiles` table and related components are preserved for backward compatibility
- The new system is completely separate and can coexist with the old system
- All form data is properly typed with TypeScript interfaces
- The UI maintains the existing design system and styling

