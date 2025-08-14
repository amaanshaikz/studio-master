import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PlatformDatabase } from '@/lib/platform-database';
import { TokenRefreshService } from '@/lib/token-refresh';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get Instagram connection from database
    const connection = await PlatformDatabase.getConnection(userId, 'instagram');
    if (!connection) {
      return NextResponse.json({ connected: false });
    }

    // Get Instagram data from database
    const instagramData = await PlatformDatabase.getInstagramData(userId);
    if (!instagramData) {
      return NextResponse.json({ connected: false });
    }

    // Get fresh access token with refresh check
    const accessToken = await TokenRefreshService.getValidAccessToken(userId, 'instagram');
    if (!accessToken) {
      console.error('Instagram API: No valid access token available');
      return NextResponse.json({ connected: false });
    }

    try {
      // Get user profile from Instagram API
      const profileResponse = await fetch(
        `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${accessToken}`
      );

      if (!profileResponse.ok) {
        console.error('Instagram API: Profile fetch failed:', {
          status: profileResponse.status,
          statusText: profileResponse.statusText
        });
        
        // Token might be expired or invalid
        await PlatformDatabase.disconnectPlatform(userId, 'instagram');
        return NextResponse.json({ connected: false });
      }

      const profileData = await profileResponse.json();

      // Get user media
      const mediaResponse = await fetch(
        `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,caption,permalink,timestamp,like_count,comments_count&access_token=${accessToken}`
      );

      let media = [];
      if (mediaResponse.ok) {
        const mediaData = await mediaResponse.json();
        media = mediaData.data || [];
      } else {
        console.warn('Instagram API: Media fetch failed:', {
          status: mediaResponse.status,
          statusText: mediaResponse.statusText
        });
      }

      // Extract captions and hashtags from media
      const captions: string[] = [];
      const hashtags: string[] = [];
      const reels: any[] = [];
      const posts: any[] = [];

      media.forEach((item: any) => {
        if (item.caption) {
          captions.push(item.caption);
          
          const hashtagRegex = /#\w+/g;
          const foundHashtags = item.caption.match(hashtagRegex);
          if (foundHashtags) {
            hashtags.push(...foundHashtags);
          }
        }

        if (item.media_type === 'VIDEO') {
          reels.push(item);
        } else {
          posts.push(item);
        }
      });

      // Update Instagram data in database
      await PlatformDatabase.upsertInstagramData(
        userId,
        connection.id,
        profileData.id,
        {
          username: profileData.username,
          account_type: profileData.account_type,
          media_count: media.length,
        }
      );

      return NextResponse.json({
        connected: true,
        username: profileData.username,
        fullName: instagramData.full_name,
        profilePicture: instagramData.profile_picture_url,
        bio: instagramData.bio,
        followers: instagramData.follower_count,
        following: instagramData.following_count,
        mediaCount: media.length,
        accountType: profileData.account_type,
        media: media,
        captions: captions,
        hashtags: [...new Set(hashtags)], // Remove duplicates
        reels: reels,
        posts: posts,
        lastSync: new Date().toISOString(),
      });

    } catch (apiError) {
      console.error('Instagram API error:', apiError);
      return NextResponse.json({ 
        connected: false, 
        error: 'Failed to fetch Instagram data' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Instagram platform API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get Instagram connection from database
    const connection = await PlatformDatabase.getConnection(userId, 'instagram');
    if (!connection) {
      return NextResponse.json({ error: 'Instagram not connected' }, { status: 400 });
    }

    // Refresh data by calling the same logic as GET
    const accessToken = await TokenRefreshService.getValidAccessToken(userId, 'instagram');
    if (!accessToken) {
      return NextResponse.json({ error: 'No valid access token available' }, { status: 400 });
    }

    // Get fresh data from Instagram API
    const profileResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${accessToken}`
    );

    if (!profileResponse.ok) {
      await PlatformDatabase.disconnectPlatform(userId, 'instagram');
      return NextResponse.json({ connected: false });
    }

    const profileData = await profileResponse.json();

    // Get user media
    const mediaResponse = await fetch(
      `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,caption,permalink,timestamp,like_count,comments_count&access_token=${accessToken}`
    );

    let media = [];
    if (mediaResponse.ok) {
      const mediaData = await mediaResponse.json();
      media = mediaData.data || [];
    }

    // Extract captions and hashtags
    const captions: string[] = [];
    const hashtags: string[] = [];
    const reels: any[] = [];
    const posts: any[] = [];

    media.forEach((item: any) => {
      if (item.caption) {
        captions.push(item.caption);
        
        const hashtagRegex = /#\w+/g;
        const foundHashtags = item.caption.match(hashtagRegex);
        if (foundHashtags) {
          hashtags.push(...foundHashtags);
        }
      }

      if (item.media_type === 'VIDEO') {
        reels.push(item);
      } else {
        posts.push(item);
      }
    });

    // Update Instagram data in database
    await PlatformDatabase.upsertInstagramData(
      userId,
      connection.id,
      profileData.id,
      {
        username: profileData.username,
        account_type: profileData.account_type,
        media_count: media.length,
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Instagram data refreshed successfully',
      data: {
        username: profileData.username,
        mediaCount: media.length,
        captions: captions,
        hashtags: [...new Set(hashtags)],
        reels: reels,
        posts: posts,
        lastSync: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('Instagram platform POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 