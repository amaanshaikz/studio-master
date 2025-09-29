import { createClient } from '@supabase/supabase-js';
import { encryptToken, decryptToken, safeDecryptToken } from './token-encryption';

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase env vars missing');
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}

export interface PlatformConnection {
  id: string;
  user_id: string;
  platform: 'instagram' | 'linkedin';
  platform_user_id: string;
  access_token: string;
  refresh_token?: string;
  token_expires_at?: string;
  profile_data?: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InstagramData {
  id: string;
  user_id: string;
  connection_id: string;
  instagram_user_id: string;
  username?: string;
  full_name?: string;
  bio?: string;
  profile_picture_url?: string;
  website?: string;
  media_count: number;
  follower_count: number;
  following_count: number;
  account_type?: string;
  is_private: boolean;
  is_verified: boolean;
  business_category_name?: string;
  category_name?: string;
  created_at: string;
  updated_at: string;
}

export interface LinkedInData {
  id: string;
  user_id: string;
  connection_id: string;
  linkedin_user_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  profile_picture_url?: string;
  headline?: string;
  summary?: string;
  location?: string;
  industry?: string;
  connection_count: number;
  follower_count: number;
  public_profile_url?: string;
  created_at: string;
  updated_at: string;
}

export interface WebhookEvent {
  id: string;
  platform: 'instagram' | 'linkedin';
  event_type: string;
  event_data: any;
  processed: boolean;
  processed_at?: string;
  error_message?: string;
  retry_count: number;
  created_at: string;
}

/**
 * Platform Connection Management
 */
export class PlatformDatabase {
  /**
   * Create or update a platform connection
   */
  static async upsertConnection(
    userId: string,
    platform: 'instagram' | 'linkedin',
    platformUserId: string,
    accessToken: string,
    refreshToken?: string,
    tokenExpiresAt?: Date,
    profileData?: any
  ): Promise<PlatformConnection> {
    const encryptedAccessToken = encryptToken(accessToken);
    const encryptedRefreshToken = refreshToken ? encryptToken(refreshToken) : null;

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('platform_connections')
      .upsert({
        user_id: userId,
        platform,
        platform_user_id: platformUserId,
        access_token: encryptedAccessToken,
        refresh_token: encryptedRefreshToken,
        token_expires_at: tokenExpiresAt?.toISOString(),
        profile_data: profileData,
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error upserting platform connection:', error);
      throw new Error(`Failed to save ${platform} connection: ${error.message}`);
    }

    return data;
  }

  /**
   * Get a platform connection for a user
   */
  static async getConnection(
    userId: string,
    platform: 'instagram' | 'linkedin'
  ): Promise<PlatformConnection | null> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('platform_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('platform', platform)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No connection found
      }
      console.error('Error getting platform connection:', error);
      throw new Error(`Failed to get ${platform} connection: ${error.message}`);
    }

    return data;
  }

  /**
   * Get decrypted access token for API calls
   */
  static async getAccessToken(
    userId: string,
    platform: 'instagram' | 'linkedin'
  ): Promise<string | null> {
    const connection = await this.getConnection(userId, platform);
    if (!connection) return null;

    try {
      return safeDecryptToken(connection.access_token);
    } catch (error) {
      console.error(`Error decrypting ${platform} access token:`, error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static async isTokenExpired(
    userId: string,
    platform: 'instagram' | 'linkedin'
  ): Promise<boolean> {
    const connection = await this.getConnection(userId, platform);
    if (!connection || !connection.token_expires_at) return false;

    return new Date(connection.token_expires_at) <= new Date();
  }

  /**
   * Disconnect a platform
   */
  static async disconnectPlatform(
    userId: string,
    platform: 'instagram' | 'linkedin'
  ): Promise<void> {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('platform_connections')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('platform', platform);

    if (error) {
      console.error('Error disconnecting platform:', error);
      throw new Error(`Failed to disconnect ${platform}: ${error.message}`);
    }
  }

  /**
   * Instagram Data Management
   */
  static async upsertInstagramData(
    userId: string,
    connectionId: string,
    instagramUserId: string,
    data: Partial<InstagramData>
  ): Promise<InstagramData> {
    const supabase = getSupabase();
    const { data: result, error } = await supabase
      .from('instagram_data')
      .upsert({
        user_id: userId,
        connection_id: connectionId,
        instagram_user_id: instagramUserId,
        ...data,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error upserting Instagram data:', error);
      throw new Error(`Failed to save Instagram data: ${error.message}`);
    }

    return result;
  }

  static async getInstagramData(userId: string): Promise<InstagramData | null> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('instagram_data')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error getting Instagram data:', error);
      throw new Error(`Failed to get Instagram data: ${error.message}`);
    }

    return data;
  }

  /**
   * LinkedIn Data Management
   */
  static async upsertLinkedInData(
    userId: string,
    connectionId: string,
    linkedinUserId: string,
    data: Partial<LinkedInData>
  ): Promise<LinkedInData> {
    const supabase = getSupabase();
    const { data: result, error } = await supabase
      .from('linkedin_data')
      .upsert({
        user_id: userId,
        connection_id: connectionId,
        linkedin_user_id: linkedinUserId,
        ...data,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error upserting LinkedIn data:', error);
      throw new Error(`Failed to save LinkedIn data: ${error.message}`);
    }

    return result;
  }

  static async getLinkedInData(userId: string): Promise<LinkedInData | null> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('linkedin_data')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error getting LinkedIn data:', error);
      throw new Error(`Failed to get LinkedIn data: ${error.message}`);
    }

    return data;
  }

  /**
   * Webhook Event Management
   */
  static async createWebhookEvent(
    platform: 'instagram' | 'linkedin',
    eventType: string,
    eventData: any
  ): Promise<WebhookEvent> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('webhook_events')
      .insert({
        platform,
        event_type: eventType,
        event_data: eventData,
        processed: false,
        retry_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating webhook event:', error);
      throw new Error(`Failed to create webhook event: ${error.message}`);
    }

    return data;
  }

  static async markWebhookEventProcessed(
    eventId: string,
    errorMessage?: string
  ): Promise<void> {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('webhook_events')
      .update({
        processed: true,
        processed_at: new Date().toISOString(),
        error_message: errorMessage,
        retry_count: supabase.rpc('increment', { column: 'retry_count' }),
      })
      .eq('id', eventId);

    if (error) {
      console.error('Error marking webhook event processed:', error);
      throw new Error(`Failed to mark webhook event processed: ${error.message}`);
    }
  }

  static async getUnprocessedWebhookEvents(
    platform?: 'instagram' | 'linkedin'
  ): Promise<WebhookEvent[]> {
    const supabase = getSupabase();
    let query = supabase
      .from('webhook_events')
      .select('*')
      .eq('processed', false)
      .order('created_at', { ascending: true });

    if (platform) {
      query = query.eq('platform', platform);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error getting unprocessed webhook events:', error);
      throw new Error(`Failed to get webhook events: ${error.message}`);
    }

    return data || [];
  }
}
