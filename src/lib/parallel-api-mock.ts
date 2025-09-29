// Mock Parallel API for testing when the real API is not available
import { CreatorIntelligenceData } from '@/types/creator-intelligence';

export interface ParallelTaskRun {
  id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
  created_at: string;
  updated_at: string;
}

// Mock creator intelligence data
const MOCK_CREATOR_DATA: CreatorIntelligenceData = {
  username: "test_creator",
  full_name: "Test Creator",
  follower_count: 125000,
  post_count: 342,
  bio: "Content creator | Travel enthusiast | Lifestyle blogger",

  primary_niche: "Lifestyle",
  sub_niches: ["Travel", "Fashion", "Food"],

  visual_aesthetics: "Minimalist, clean, high contrast with warm tones",
  tone_of_voice: "Professional yet approachable, inspiring and motivational",
  recurring_motifs: "Sunset shots, coffee cups, minimalist setups",

  storytelling_patterns: "Before/after transformations, day-in-the-life content",
  editing_techniques: "Warm tones, high saturation, consistent color palette",
  performance_elements: "Direct eye contact, confident poses, natural expressions",

  format_type: "Reels, Stories, Posts",
  typical_context: "Lifestyle, daily routines, travel experiences",

  overall_engagement_rate: "3.2%",

  average_views_status: "High performing with consistent engagement",
  average_likes_proxy: "Consistent engagement across all content types",
  data_limitation_note: "Limited historical data available for analysis",

  viral_post_description: "My morning routine transformation",
  viral_post_likes: 50000,
  viral_post_comments: 2500,
  viral_post_impact: "Generated 20k new followers and increased brand partnerships",

  target_demographics: "Females 18-35, urban areas, college-educated",
  target_interests: "Fashion, Beauty, Lifestyle, Travel",
  actual_demographics: "Females 22-28, college-educated, urban professionals",
  audience_evidence: "Comment analysis shows high engagement from target demographic",
  audience_alignment: "High alignment with slight skew toward younger audience",
  audience_summary: "Audience matches target with 85% alignment, slightly younger than expected",

  key_content_themes: [
    {
      theme: "Morning Routines",
      description: "Daily morning routine content showing productivity and wellness"
    },
    {
      theme: "Travel Experiences",
      description: "Travel content featuring destinations and cultural experiences"
    },
    {
      theme: "Fashion & Style",
      description: "Outfit posts and fashion inspiration content"
    }
  ],

  representative_content_examples: [
    {
      content_type: "Reel",
      title_or_caption: "My 5 AM morning routine that changed my life",
      theme: "Morning Routines"
    },
    {
      content_type: "Post",
      title_or_caption: "Santorini sunset vibes ✨",
      theme: "Travel Experiences"
    },
    {
      content_type: "Story",
      title_or_caption: "OOTD: Casual Friday outfit",
      theme: "Fashion & Style"
    }
  ],

  key_hashtags: [
    {
      hashtag: "#morningroutine",
      category: "Lifestyle"
    },
    {
      hashtag: "#travel",
      category: "Travel"
    },
    {
      hashtag: "#fashion",
      category: "Fashion"
    },
    {
      hashtag: "#lifestyle",
      category: "General"
    }
  ]
};

export async function createInstagramAnalysisTask(instagramUrl: string): Promise<ParallelTaskRun> {
  console.log('🎭 Using MOCK Parallel API for testing');
  console.log('Instagram URL:', instagramUrl);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const taskId = `mock_task_${Date.now()}`;
  
  return {
    id: taskId,
    status: 'queued',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

export async function getTaskRunStatus(taskId: string): Promise<ParallelTaskRun> {
  console.log('🎭 Mock API: Getting task status for', taskId);
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulate different statuses over time
  const isCompleted = Math.random() > 0.3; // 70% chance of completion
  
  if (isCompleted) {
    return {
      id: taskId,
      status: 'completed',
      result: MOCK_CREATOR_DATA,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } else {
    return {
      id: taskId,
      status: 'running',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
}

export function isParallelAPIConfigured(): boolean {
  return true; // Mock is always configured
}

export function getParallelAPIKeyStatus(): { configured: boolean; keyLength: number; keyPrefix: string } {
  return {
    configured: true,
    keyLength: 0,
    keyPrefix: 'MOCK_API'
  };
}
