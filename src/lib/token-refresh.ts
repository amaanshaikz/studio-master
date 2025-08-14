import { PlatformDatabase } from './platform-database';

/**
 * Token refresh service for Instagram and LinkedIn
 * Handles automatic token refresh when tokens expire
 */

export class TokenRefreshService {
  /**
   * Check and refresh Instagram token if needed
   */
  static async refreshInstagramTokenIfNeeded(userId: string): Promise<boolean> {
    try {
      const connection = await PlatformDatabase.getConnection(userId, 'instagram');
      if (!connection) {
        console.log('No Instagram connection found for user:', userId);
        return false;
      }

      // Instagram Basic Display API tokens don't expire, but we can check if they're still valid
      const accessToken = await PlatformDatabase.getAccessToken(userId, 'instagram');
      if (!accessToken) {
        console.log('No Instagram access token found for user:', userId);
        return false;
      }

      // Test token validity by making a simple API call
      const testResponse = await fetch(
        `https://graph.instagram.com/me?fields=id&access_token=${accessToken}`
      );

      if (testResponse.ok) {
        console.log('Instagram token is still valid for user:', userId);
        return true;
      } else {
        console.log('Instagram token is invalid for user:', userId);
        // Token is invalid, disconnect the platform
        await PlatformDatabase.disconnectPlatform(userId, 'instagram');
        return false;
      }

    } catch (error) {
      console.error('Error checking Instagram token:', error);
      return false;
    }
  }

  /**
   * Check and refresh LinkedIn token if needed
   */
  static async refreshLinkedInTokenIfNeeded(userId: string): Promise<boolean> {
    try {
      const connection = await PlatformDatabase.getConnection(userId, 'linkedin');
      if (!connection) {
        console.log('No LinkedIn connection found for user:', userId);
        return false;
      }

      // Check if token is expired
      const isExpired = await PlatformDatabase.isTokenExpired(userId, 'linkedin');
      if (!isExpired) {
        console.log('LinkedIn token is still valid for user:', userId);
        return true;
      }

      console.log('LinkedIn token is expired for user:', userId);

      // LinkedIn doesn't provide refresh tokens in the basic OAuth flow
      // We need to re-authenticate the user
      // For now, we'll disconnect the platform and require re-authentication
      await PlatformDatabase.disconnectPlatform(userId, 'linkedin');
      return false;

    } catch (error) {
      console.error('Error checking LinkedIn token:', error);
      return false;
    }
  }

  /**
   * Refresh all platform tokens for a user
   */
  static async refreshAllTokens(userId: string): Promise<{
    instagram: boolean;
    linkedin: boolean;
  }> {
    const [instagramValid, linkedinValid] = await Promise.all([
      this.refreshInstagramTokenIfNeeded(userId),
      this.refreshLinkedInTokenIfNeeded(userId),
    ]);

    return {
      instagram: instagramValid,
      linkedin: linkedinValid,
    };
  }

  /**
   * Get valid access token for a platform
   */
  static async getValidAccessToken(
    userId: string,
    platform: 'instagram' | 'linkedin'
  ): Promise<string | null> {
    try {
      // Check if token needs refresh
      if (platform === 'instagram') {
        const isValid = await this.refreshInstagramTokenIfNeeded(userId);
        if (!isValid) return null;
      } else if (platform === 'linkedin') {
        const isValid = await this.refreshLinkedInTokenIfNeeded(userId);
        if (!isValid) return null;
      }

      // Get the access token
      return await PlatformDatabase.getAccessToken(userId, platform);

    } catch (error) {
      console.error(`Error getting valid ${platform} access token:`, error);
      return null;
    }
  }
}
