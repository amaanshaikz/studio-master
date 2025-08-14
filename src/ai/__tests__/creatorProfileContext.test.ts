import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildCreatorProfileContext, invalidateCreatorProfileCache, getCacheStats } from '../creatorProfileContext';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@/lib/auth';

// Mock dependencies
vi.mock('@supabase/supabase-js');
vi.mock('@/lib/auth');

const mockSupabase = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn(),
};

const mockAuth = auth as jest.MockedFunction<typeof auth>;

describe('buildCreatorProfileContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
    invalidateCreatorProfileCache(); // Clear cache before each test
  });

  afterEach(() => {
    invalidateCreatorProfileCache(); // Clear cache after each test
  });

  it('should return formatted profile for complete creator data', async () => {
    // Mock authentication
    mockAuth.mockResolvedValue({
      user: { id: 'test-user-id' },
    } as any);

    // Mock complete creator data
    const mockCreatorData = {
      id: 'creator-id',
      user_id: 'test-user-id',
      full_name: 'John Doe',
      age: 25,
      location: 'United States',
      primary_language: 'English',
      platforms: ['YouTube', 'Instagram'],
      main_focus_platform: 'YouTube',
      other_platforms: null,
      primary_niche: 'Technology',
      sub_niche: 'Web Development',
      target_audience: ['Millennials', 'Working Professionals'],
      other_niche: null,
      other_target_audience: null,
      brand_words: 'Educational, Professional, Helpful',
      tone_style: 'Professional',
      total_followers: 10000,
      average_views: 5000,
      content_formats: ['Long-form video', 'Short-form video'],
      typical_length_number: 15,
      typical_length_unit: 'minutes',
      other_formats: null,
      on_camera: 'Yes',
      use_voiceovers: 'No',
      editing_music_style: 'Clean, professional editing',
      short_term_goals: 'Reach 15k subscribers in 3 months',
      long_term_goals: 'Build sustainable income from content',
      posting_frequency: 3,
      posting_schedule: 'Weekly',
      biggest_challenge: 'Consistency in posting',
      strengths: 'Good at explaining complex topics',
      weaknesses: 'Sometimes struggle with video editing',
      income_streams: ['Sponsorships', 'Affiliate marketing'],
      brand_types_to_avoid: 'Gambling, alcohol, fast food',
      ai_help_preferences: ['Content ideas', 'Scripts', 'Hashtags'],
      niche_focus: 'Niche + Related trends',
      content_style: 'Balanced',
      non_negotiable_rules: 'No political content',
      is_setup_complete: true,
      current_step: 3,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    mockSupabase.single.mockResolvedValue({
      data: mockCreatorData,
      error: null,
    });

    const result = await buildCreatorProfileContext();

    expect(result).toBe(`Section 1 – Creator Profile & Brand
Full Name: John Doe
Age: 25
Location: United States
Primary Language: English
Main Focus Platform: YouTube
Other Platforms: -
Niche: Technology
Target Audience: Millennials, Working Professionals
Brand Words: Educational, Professional, Helpful
Followers: 10000
Average Views: 5000

Section 2 – Content Style & Workflow
Content Formats: Long-form video, Short-form video
Typical Length & Unit: 15 minutes
Inspirations/Competitors: Clean, professional editing
Short-Term Goals (3 months): Reach 15k subscribers in 3 months
Long-Term Goals (1–3 years): Build sustainable income from content

Section 3 – Growth, Monetization & AI Personalization
Biggest Strengths: Good at explaining complex topics
Biggest Challenges: Consistency in posting
Income Streams: Sponsorships, Affiliate marketing
Brand Types to Avoid: Gambling, alcohol, fast food
AI Assistance Preferences: Content ideas, Scripts, Hashtags
Content Exploration Mode: Niche + Related trends`);
  });

  it('should handle missing fields with dash placeholders', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'test-user-id' },
    } as any);

    // Mock creator data with missing fields
    const mockCreatorData = {
      id: 'creator-id',
      user_id: 'test-user-id',
      full_name: null,
      age: null,
      location: null,
      primary_language: null,
      platforms: null,
      main_focus_platform: null,
      other_platforms: null,
      primary_niche: null,
      sub_niche: null,
      target_audience: null,
      other_niche: null,
      other_target_audience: null,
      brand_words: null,
      tone_style: null,
      total_followers: null,
      average_views: null,
      content_formats: null,
      typical_length_number: null,
      typical_length_unit: null,
      other_formats: null,
      on_camera: null,
      use_voiceovers: null,
      editing_music_style: null,
      short_term_goals: null,
      long_term_goals: null,
      posting_frequency: null,
      posting_schedule: null,
      biggest_challenge: null,
      strengths: null,
      weaknesses: null,
      income_streams: null,
      brand_types_to_avoid: null,
      ai_help_preferences: null,
      niche_focus: null,
      content_style: null,
      non_negotiable_rules: null,
      is_setup_complete: null,
      current_step: null,
      created_at: null,
      updated_at: null,
    };

    mockSupabase.single.mockResolvedValue({
      data: mockCreatorData,
      error: null,
    });

    const result = await buildCreatorProfileContext();

    expect(result).toBe(`Section 1 – Creator Profile & Brand
Full Name: -
Age: -
Location: -
Primary Language: -
Main Focus Platform: -
Other Platforms: -
Niche: -
Target Audience: -
Brand Words: -
Followers: -
Average Views: -

Section 2 – Content Style & Workflow
Content Formats: -
Typical Length & Unit: - -
Inspirations/Competitors: -
Short-Term Goals (3 months): -
Long-Term Goals (1–3 years): -

Section 3 – Growth, Monetization & AI Personalization
Biggest Strengths: -
Biggest Challenges: -
Income Streams: -
Brand Types to Avoid: -
AI Assistance Preferences: -
Content Exploration Mode: -`);
  });

  it('should handle empty arrays correctly', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'test-user-id' },
    } as any);

    const mockCreatorData = {
      id: 'creator-id',
      user_id: 'test-user-id',
      full_name: 'Test User',
      age: 30,
      location: 'Canada',
      primary_language: 'English',
      platforms: [],
      main_focus_platform: 'Instagram',
      other_platforms: null,
      primary_niche: 'Lifestyle',
      sub_niche: null,
      target_audience: [],
      other_niche: null,
      other_target_audience: null,
      brand_words: 'Authentic, Inspiring',
      tone_style: 'Casual',
      total_followers: 5000,
      average_views: 2000,
      content_formats: [],
      typical_length_number: 60,
      typical_length_unit: 'seconds',
      other_formats: null,
      on_camera: 'Sometimes',
      use_voiceovers: 'Yes',
      editing_music_style: null,
      short_term_goals: 'Grow to 10k followers',
      long_term_goals: 'Monetize content',
      posting_frequency: 5,
      posting_schedule: 'Daily',
      biggest_challenge: 'Finding time to create',
      strengths: 'Good at connecting with audience',
      weaknesses: 'Technical skills',
      income_streams: [],
      brand_types_to_avoid: null,
      ai_help_preferences: [],
      niche_focus: 'Strictly niche',
      content_style: 'Conservative',
      non_negotiable_rules: null,
      is_setup_complete: true,
      current_step: 3,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    mockSupabase.single.mockResolvedValue({
      data: mockCreatorData,
      error: null,
    });

    const result = await buildCreatorProfileContext();

    expect(result).toContain('Platforms: -');
    expect(result).toContain('Target Audience: -');
    expect(result).toContain('Content Formats: -');
    expect(result).toContain('Income Streams: -');
    expect(result).toContain('AI Assistance Preferences: -');
  });

  it('should return fallback message when no creator profile exists', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'test-user-id' },
    } as any);

    mockSupabase.single.mockResolvedValue({
      data: null,
      error: { code: 'PGRST116' }, // No rows returned
    });

    const result = await buildCreatorProfileContext();

    expect(result).toBe('Creator profile unavailable.');
  });

  it('should return fallback message when database error occurs', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'test-user-id' },
    } as any);

    mockSupabase.single.mockResolvedValue({
      data: null,
      error: { message: 'Database connection failed' },
    });

    const result = await buildCreatorProfileContext();

    expect(result).toBe('Creator profile unavailable.');
  });

  it('should return fallback message when user is not authenticated', async () => {
    mockAuth.mockResolvedValue(null);

    const result = await buildCreatorProfileContext();

    expect(result).toBe('Creator profile unavailable.');
  });

  it('should cache results and return cached version on subsequent calls', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'test-user-id' },
    } as any);

    const mockCreatorData = {
      id: 'creator-id',
      user_id: 'test-user-id',
      full_name: 'Cached User',
      age: 25,
      location: 'Test Location',
      primary_language: 'English',
      platforms: ['YouTube'],
      main_focus_platform: 'YouTube',
      other_platforms: null,
      primary_niche: 'Technology',
      sub_niche: null,
      target_audience: ['Tech Enthusiasts'],
      other_niche: null,
      other_target_audience: null,
      brand_words: 'Tech, Educational',
      tone_style: 'Professional',
      total_followers: 1000,
      average_views: 500,
      content_formats: ['Long-form video'],
      typical_length_number: 10,
      typical_length_unit: 'minutes',
      other_formats: null,
      on_camera: 'Yes',
      use_voiceovers: 'No',
      editing_music_style: 'Simple editing',
      short_term_goals: 'Reach 5k subscribers',
      long_term_goals: 'Build tech community',
      posting_frequency: 2,
      posting_schedule: 'Weekly',
      biggest_challenge: 'Consistency',
      strengths: 'Technical knowledge',
      weaknesses: 'Video editing',
      income_streams: ['Sponsorships'],
      brand_types_to_avoid: null,
      ai_help_preferences: ['Content ideas'],
      niche_focus: 'Strictly niche',
      content_style: 'Conservative',
      non_negotiable_rules: null,
      is_setup_complete: true,
      current_step: 3,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    mockSupabase.single.mockResolvedValue({
      data: mockCreatorData,
      error: null,
    });

    // First call should hit the database
    const result1 = await buildCreatorProfileContext();
    expect(mockSupabase.single).toHaveBeenCalledTimes(1);

    // Second call should use cache
    const result2 = await buildCreatorProfileContext();
    expect(mockSupabase.single).toHaveBeenCalledTimes(1); // Should not be called again

    expect(result1).toBe(result2);
  });

  it('should provide cache statistics', () => {
    const stats = getCacheStats();
    expect(stats).toHaveProperty('size');
    expect(stats).toHaveProperty('entries');
    expect(Array.isArray(stats.entries)).toBe(true);
  });

  it('should invalidate cache correctly', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'test-user-id' },
    } as any);

    const mockCreatorData = {
      id: 'creator-id',
      user_id: 'test-user-id',
      full_name: 'Test User',
      age: 25,
      location: 'Test',
      primary_language: 'English',
      platforms: null,
      main_focus_platform: null,
      other_platforms: null,
      primary_niche: null,
      sub_niche: null,
      target_audience: null,
      other_niche: null,
      other_target_audience: null,
      brand_words: null,
      tone_style: null,
      total_followers: null,
      average_views: null,
      content_formats: null,
      typical_length_number: null,
      typical_length_unit: null,
      other_formats: null,
      on_camera: null,
      use_voiceovers: null,
      editing_music_style: null,
      short_term_goals: null,
      long_term_goals: null,
      posting_frequency: null,
      posting_schedule: null,
      biggest_challenge: null,
      strengths: null,
      weaknesses: null,
      income_streams: null,
      brand_types_to_avoid: null,
      ai_help_preferences: null,
      niche_focus: null,
      content_style: null,
      non_negotiable_rules: null,
      is_setup_complete: null,
      current_step: null,
      created_at: null,
      updated_at: null,
    };

    mockSupabase.single.mockResolvedValue({
      data: mockCreatorData,
      error: null,
    });

    // First call
    await buildCreatorProfileContext();
    expect(mockSupabase.single).toHaveBeenCalledTimes(1);

    // Invalidate cache
    invalidateCreatorProfileCache();

    // Second call should hit database again
    await buildCreatorProfileContext();
    expect(mockSupabase.single).toHaveBeenCalledTimes(2);
  });
});

