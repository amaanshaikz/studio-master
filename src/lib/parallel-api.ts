import { CreatorIntelligenceData } from '@/types/creator-intelligence';

const PARALLEL_API_BASE_URL = 'https://api.parallel.ai';
const PARALLEL_API_KEY = process.env.PARALLEL_API_KEY;

if (!PARALLEL_API_KEY) {
  console.warn('PARALLEL_API_KEY not found in environment variables');
}

export interface ParallelTaskRun {
  run_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  is_active: boolean;
  result?: any;
  result_url?: string;
  warnings?: any;
  errors?: any;
  processor: string;
  metadata?: any;
  created_at: string;
  modified_at: string;
}

export interface TaskRunResult {
  run: ParallelTaskRun;
  output?: {
    content: string;
    basis: FieldBasis[];
    type: string;
  };
}

export interface FieldBasis {
  field: string;
  citations: Citation[];
  reasoning: string;
  confidence?: string;
}

export interface Citation {
  url: string;
  excerpts?: string[];
}

export interface CreateTaskRunRequest {
  input: string;
  task_spec: {
    output_schema: {
      type: "json";
      json_schema: any;
    };
    input_schema?: any;
  };
  processor: string;
  metadata?: any;
}

const CREATOR_INTELLIGENCE_SCHEMA = {
  type: "object",
  description: "Analyze the Instagram creator's profile and extract comprehensive creator intelligence data. Focus on visible content, engagement patterns, and audience insights from their public profile.",
  properties: {
    username: { 
      type: "string", 
      description: "Instagram username without @ symbol" 
    },
    full_name: { 
      type: "string", 
      description: "Display name shown on the profile" 
    },
    follower_count: { 
      type: "integer", 
      description: "Number of followers (if visible)" 
    },
    post_count: { 
      type: "integer", 
      description: "Number of posts (if visible)" 
    },
    bio: { 
      type: "string", 
      description: "Profile bio text" 
    },

    primary_niche: { 
      type: "string", 
      description: "Main content category (e.g., Fashion, Travel, Food, Lifestyle)" 
    },
    sub_niches: { 
      type: "array", 
      items: { type: "string" },
      description: "Array of sub-categories within the main niche" 
    },

    visual_aesthetics: { 
      type: "string", 
      description: "Visual style description based on content analysis" 
    },
    tone_of_voice: { 
      type: "string", 
      description: "Communication style and personality" 
    },
    recurring_motifs: { 
      type: "string", 
      description: "Common visual elements or themes" 
    },

    storytelling_patterns: { 
      type: "string", 
      description: "How they structure their content narratives" 
    },
    editing_techniques: { 
      type: "string", 
      description: "Visual editing style and techniques used" 
    },
    performance_elements: { 
      type: "string", 
      description: "Performance aspects like poses, expressions, etc." 
    },

    format_type: { 
      type: "string", 
      description: "Primary content formats used (Reels, Posts, Stories)" 
    },
    typical_context: { 
      type: "string", 
      description: "Common content contexts and settings" 
    },

    overall_engagement_rate: { 
      type: "string", 
      description: "Estimated engagement rate based on visible metrics" 
    },

    average_views_status: { 
      type: "string", 
      description: "Performance level of their content" 
    },
    average_likes_proxy: { 
      type: "string", 
      description: "Likes performance relative to follower count" 
    },
    data_limitation_note: { 
      type: "string", 
      description: "Note about data availability limitations" 
    },

    viral_post_description: { 
      type: "string", 
      description: "Description of their most viral/engaging post" 
    },
    viral_post_likes: { 
      type: "integer", 
      description: "Likes count on viral post (if visible)" 
    },
    viral_post_comments: { 
      type: "integer", 
      description: "Comments count on viral post (if visible)" 
    },
    viral_post_impact: { 
      type: "string", 
      description: "Impact and reach of viral content" 
    },

    target_demographics: { 
      type: "string", 
      description: "Intended target audience demographics" 
    },
    target_interests: { 
      type: "string", 
      description: "Target audience interests and preferences" 
    },
    actual_demographics: { 
      type: "string", 
      description: "Inferred actual audience demographics" 
    },
    audience_evidence: { 
      type: "string", 
      description: "Evidence supporting demographic analysis" 
    },
    audience_alignment: { 
      type: "string", 
      description: "How well target and actual audiences align" 
    },
    audience_summary: { 
      type: "string", 
      description: "Overall audience analysis summary" 
    },

    key_content_themes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          theme: { type: "string", description: "Content theme name" },
          description: { type: "string", description: "Description of the theme" }
        },
        required: ["theme", "description"],
        additionalProperties: false
      },
      description: "Array of main content themes with descriptions"
    },

    representative_content_examples: {
      type: "array",
      items: {
        type: "object",
        properties: {
          content_type: { type: "string", description: "Type of content (Reel, Post, Story)" },
          title_or_caption: { type: "string", description: "Content title or caption" },
          theme: { type: "string", description: "Theme category" }
        },
        required: ["content_type", "title_or_caption", "theme"],
        additionalProperties: false
      },
      description: "Array of representative content examples"
    },

    key_hashtags: {
      type: "array",
      items: {
        type: "object",
        properties: {
          hashtag: { type: "string", description: "Hashtag text" },
          category: { type: "string", description: "Hashtag category" }
        },
        required: ["hashtag", "category"],
        additionalProperties: false
      },
      description: "Array of important hashtags with categories"
    }
  },
  required: [
    "username", "full_name", "follower_count", "post_count", "bio",
    "primary_niche", "sub_niches", "visual_aesthetics", "tone_of_voice", "recurring_motifs",
    "storytelling_patterns", "editing_techniques", "performance_elements",
    "format_type", "typical_context", "overall_engagement_rate",
    "average_views_status", "average_likes_proxy", "data_limitation_note",
    "viral_post_description", "viral_post_likes", "viral_post_comments", "viral_post_impact",
    "target_demographics", "target_interests", "actual_demographics", "audience_evidence", "audience_alignment", "audience_summary",
    "key_content_themes", "representative_content_examples", "key_hashtags"
  ],
  additionalProperties: false
};

export async function createInstagramAnalysisTask(instagramUrl: string): Promise<ParallelTaskRun> {
  if (!PARALLEL_API_KEY) {
    throw new Error('Parallel API key not configured');
  }

  const requestBody: CreateTaskRunRequest = {
    input: `You are a structured research agent. Your task is to analyze a social media creator's profile and generate a detailed, structured dataset. Analyze the Instagram profile at ${instagramUrl} and provide comprehensive creator intelligence data. ⚠️ Output Rules: - Respond in **valid JSON only**, no markdown, no explanations, no comments. - Always include **all fields**, even if inferred or empty. - Keep text concise but descriptive. - Arrays must always return at least an empty array if no data is available.`,
    task_spec: {
      output_schema: {
        type: "json",
        json_schema: CREATOR_INTELLIGENCE_SCHEMA
      }
    },
    processor: 'pro', // Using pro processor for deep research
    metadata: {
      task_type: 'instagram_creator_analysis',
      created_at: new Date().toISOString()
    }
  };

  console.log('🚀 [PARALLEL API] Creating task with request:', JSON.stringify(requestBody, null, 2));
  console.log('🔗 [PARALLEL API] URL:', `${PARALLEL_API_BASE_URL}/v1/tasks/runs`);
  console.log('🔑 [PARALLEL API] Key (first 10 chars):', PARALLEL_API_KEY.substring(0, 10) + '...');
  console.log('📊 [PARALLEL API] Request size:', JSON.stringify(requestBody).length, 'bytes');
  console.log('⏰ [PARALLEL API] Request timestamp:', new Date().toISOString());

  const response = await fetch(`${PARALLEL_API_BASE_URL}/v1/tasks/runs`, {
    method: 'POST',
    headers: {
      'x-api-key': PARALLEL_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  console.log('📥 [PARALLEL API] Response status:', response.status);
  console.log('📋 [PARALLEL API] Response headers:', Object.fromEntries(response.headers.entries()));
  console.log('⏱️ [PARALLEL API] Request completed at:', new Date().toISOString());

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      console.log('Parallel API error data:', JSON.stringify(errorData, null, 2));
      
      // Handle different error response formats
      if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = typeof errorData.error === 'string' ? errorData.error : JSON.stringify(errorData.error);
      } else if (errorData.detail) {
        errorMessage = errorData.detail;
      } else {
        errorMessage = JSON.stringify(errorData);
      }
    } catch (parseError) {
      console.log('Could not parse error response:', parseError);
      // Try to get text response
      try {
        const errorText = await response.text();
        console.log('Error response as text:', errorText);
        errorMessage = errorText || errorMessage;
      } catch (textError) {
        console.log('Could not get error text:', textError);
      }
    }
    throw new Error(`Parallel API error: ${errorMessage}`);
  }

  const result = await response.json();
  console.log('✅ [PARALLEL API] Success response:', JSON.stringify(result, null, 2));
  console.log('🆔 [PARALLEL API] Task ID:', result.run_id || result.id || 'NOT_FOUND');
  console.log('📊 [PARALLEL API] Response size:', JSON.stringify(result).length, 'bytes');
  return result;
}

export async function getTaskRunStatus(taskId: string): Promise<ParallelTaskRun> {
  if (!PARALLEL_API_KEY) {
    throw new Error('Parallel API key not configured');
  }

  console.log('🔍 [PARALLEL API] Checking status for task:', taskId);
  console.log('🔗 [PARALLEL API] Status URL:', `${PARALLEL_API_BASE_URL}/v1/tasks/runs/${taskId}`);

  const response = await fetch(`${PARALLEL_API_BASE_URL}/v1/tasks/runs/${taskId}`, {
    method: 'GET',
    headers: {
      'x-api-key': PARALLEL_API_KEY,
      'Content-Type': 'application/json',
    },
  });

  console.log('📥 [PARALLEL API] Status response:', response.status);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Parallel API error: ${errorData.message || response.statusText}`);
  }

  const result = await response.json();
  console.log('📊 [PARALLEL API] Status result:', JSON.stringify(result, null, 2));
  console.log('🔄 [PARALLEL API] Task status:', result.status);
  console.log('⚡ [PARALLEL API] Is active:', result.is_active);
  return result;
}

export async function getTaskRunResult(taskId: string): Promise<TaskRunResult> {
  if (!PARALLEL_API_KEY) {
    throw new Error('Parallel API key not configured');
  }

  console.log('📋 [PARALLEL API] Getting result for task:', taskId);
  console.log('🔗 [PARALLEL API] Result URL:', `${PARALLEL_API_BASE_URL}/v1/tasks/runs/${taskId}/result`);

  const response = await fetch(`${PARALLEL_API_BASE_URL}/v1/tasks/runs/${taskId}/result`, {
    method: 'GET',
    headers: {
      'x-api-key': PARALLEL_API_KEY,
      'Content-Type': 'application/json',
    },
  });

  console.log('📥 [PARALLEL API] Result response:', response.status);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Parallel API error: ${errorData.message || response.statusText}`);
  }

  const result = await response.json();
  console.log('✅ [PARALLEL API] Result retrieved:', JSON.stringify(result, null, 2));
  console.log('📊 [PARALLEL API] Result size:', JSON.stringify(result).length, 'bytes');
  if (result.output) {
    console.log('📄 [PARALLEL API] Output content length:', result.output.content?.length || 0, 'characters');
    console.log('🔍 [PARALLEL API] Output type:', result.output.type);
  }
  return result;
}

export function isParallelAPIConfigured(): boolean {
  return !!PARALLEL_API_KEY;
}

export function getParallelAPIKeyStatus(): { configured: boolean; keyFormat: string; keyLength: number } {
  if (!PARALLEL_API_KEY) {
    return { configured: false, keyFormat: 'none', keyLength: 0 };
  }
  
  return {
    configured: true,
    keyFormat: PARALLEL_API_KEY.startsWith('sk-') ? 'sk-prefix' : 'other',
    keyLength: PARALLEL_API_KEY.length
  };
}
