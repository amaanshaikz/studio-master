import { CreatorIntelligenceData } from '@/types/creator-intelligence';
import { CreateCreatorRecord } from '@/types/creator-database';

/**
 * Maps Parallel API response data to database record format
 */
export function mapCreatorDataToDatabase(
  creatorData: CreatorIntelligenceData,
  instagramUrl: string
): CreateCreatorRecord {
  console.log('🔄 [DATA MAPPER] Starting data mapping process');
  console.log('📊 [DATA MAPPER] Input creator data keys:', Object.keys(creatorData));
  console.log('🔗 [DATA MAPPER] Instagram URL:', instagramUrl);
  
  const mappedRecord = {
    username: creatorData.username,
    instagram_url: instagramUrl,
    full_name: creatorData.full_name || null,
    follower_count: creatorData.follower_count || null,
    post_count: creatorData.post_count || null,
    bio: creatorData.bio || null,

    // Niche
    primary_niche: creatorData.primary_niche || null,
    sub_niches: creatorData.sub_niches || null,

    // Brand Style
    visual_aesthetics: creatorData.visual_aesthetics || null,
    tone_of_voice: creatorData.tone_of_voice || null,
    recurring_motifs: creatorData.recurring_motifs || null,

    // Content Making Style
    storytelling_patterns: creatorData.storytelling_patterns || null,
    editing_techniques: creatorData.editing_techniques || null,
    performance_elements: creatorData.performance_elements || null,

    // Content Format & Context
    format_type: creatorData.format_type || null,
    typical_context: creatorData.typical_context || null,

    // Engagement
    overall_engagement_rate: creatorData.overall_engagement_rate || null,

    // Views & Likes
    average_views_status: creatorData.average_views_status || null,
    average_likes_proxy: creatorData.average_likes_proxy || null,

    // Viral Content
    viral_post_description: creatorData.viral_post_description || null,
    viral_post_likes: creatorData.viral_post_likes || null,
    viral_post_comments: creatorData.viral_post_comments || null,
    viral_post_impact: creatorData.viral_post_impact || null,

    // Audience
    target_demographics: creatorData.target_demographics || null,
    target_interests: creatorData.target_interests || null,
    actual_demographics: creatorData.actual_demographics || null,
    audience_evidence: creatorData.audience_evidence || null,
    audience_alignment: creatorData.audience_alignment || null,
    audience_summary: creatorData.audience_summary || null,

    // Nested Data
    key_content_themes: creatorData.key_content_themes || null,
    representative_content_examples: creatorData.representative_content_examples || null,
    key_hashtags: creatorData.key_hashtags || null,

    // Raw Fallback JSON
    raw_json: creatorData || null,
  };
  
  console.log('✅ [DATA MAPPER] Data mapping completed');
  console.log('📊 [DATA MAPPER] Mapped record keys:', Object.keys(mappedRecord));
  console.log('📊 [DATA MAPPER] Mapped record size:', JSON.stringify(mappedRecord).length, 'bytes');
  
  return mappedRecord;
}

/**
 * Helper function to validate creator data before mapping
 */
export function validateCreatorData(data: any): data is CreatorIntelligenceData {
  console.log('🔍 [DATA VALIDATOR] Starting validation process');
  console.log('📊 [DATA VALIDATOR] Data type:', typeof data);
  console.log('📊 [DATA VALIDATOR] Data is object:', data && typeof data === 'object');
  
  const isValid = (
    data &&
    typeof data === 'object' &&
    typeof data.username === 'string' &&
    typeof data.full_name === 'string' &&
    typeof data.follower_count === 'number' &&
    typeof data.post_count === 'number' &&
    typeof data.bio === 'string' &&
    typeof data.primary_niche === 'string' &&
    Array.isArray(data.sub_niches) &&
    typeof data.visual_aesthetics === 'string' &&
    typeof data.tone_of_voice === 'string' &&
    typeof data.recurring_motifs === 'string' &&
    typeof data.storytelling_patterns === 'string' &&
    typeof data.editing_techniques === 'string' &&
    typeof data.performance_elements === 'string' &&
    typeof data.format_type === 'string' &&
    typeof data.typical_context === 'string' &&
    typeof data.overall_engagement_rate === 'string' &&
    typeof data.average_views_status === 'string' &&
    typeof data.average_likes_proxy === 'string' &&
    typeof data.data_limitation_note === 'string' &&
    typeof data.viral_post_description === 'string' &&
    typeof data.viral_post_likes === 'number' &&
    typeof data.viral_post_comments === 'number' &&
    typeof data.viral_post_impact === 'string' &&
    typeof data.target_demographics === 'string' &&
    typeof data.target_interests === 'string' &&
    typeof data.actual_demographics === 'string' &&
    typeof data.audience_evidence === 'string' &&
    typeof data.audience_alignment === 'string' &&
    typeof data.audience_summary === 'string' &&
    Array.isArray(data.key_content_themes) &&
    Array.isArray(data.representative_content_examples) &&
    Array.isArray(data.key_hashtags)
  );
  
  console.log('✅ [DATA VALIDATOR] Validation result:', isValid);
  if (!isValid) {
    console.log('❌ [DATA VALIDATOR] Validation failed - checking individual fields:');
    console.log('  - username:', typeof data?.username, data?.username);
    console.log('  - full_name:', typeof data?.full_name, data?.full_name);
    console.log('  - follower_count:', typeof data?.follower_count, data?.follower_count);
    console.log('  - post_count:', typeof data?.post_count, data?.post_count);
    console.log('  - bio:', typeof data?.bio, data?.bio);
    console.log('  - primary_niche:', typeof data?.primary_niche, data?.primary_niche);
  }
  
  return isValid;
}
