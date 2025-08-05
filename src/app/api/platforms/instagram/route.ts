import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Mock data storage - replace with your database
const platformDataStore = new Map();

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const instagramData = platformDataStore.get(`${userId}_instagram`);

    if (!instagramData || !instagramData.connected) {
      return NextResponse.json({ connected: false });
    }

    // Fetch fresh data from Instagram API
    const accessToken = instagramData.accessToken;
    
    // Get user profile
    const profileResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${accessToken}`
    );

    if (!profileResponse.ok) {
      // Token might be expired
      platformDataStore.delete(`${userId}_instagram`);
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

    // Get insights (requires business account)
    let insights = null;
    try {
      const insightsResponse = await fetch(
        `https://graph.instagram.com/me/insights?metric=impressions,reach,profile_views&access_token=${accessToken}`
      );
      if (insightsResponse.ok) {
        insights = await insightsResponse.json();
      }
    } catch (error) {
      console.log('Insights not available for this account type');
    }

    // Extract captions and hashtags from media
    const captions: string[] = [];
    const hashtags: string[] = [];
    const reels: any[] = [];
    const posts: any[] = [];

    media.forEach((item: any) => {
      if (item.caption) {
        captions.push(item.caption);
        
        // Extract hashtags
        const hashtagRegex = /#\w+/g;
        const foundHashtags = item.caption.match(hashtagRegex);
        if (foundHashtags) {
          hashtags.push(...foundHashtags);
        }
      }

      // Categorize media
      if (item.media_type === 'VIDEO') {
        reels.push(item);
      } else {
        posts.push(item);
      }
    });

    const updatedData = {
      connected: true,
      username: profileData.username,
      fullName: profileData.username, // Instagram Basic Display API doesn't provide full name
      bio: '', // Instagram Basic Display API doesn't provide bio
      profilePicture: '', // Instagram Basic Display API doesn't provide profile picture
      followers: 0, // Instagram Basic Display API doesn't provide follower count
      following: 0,
      posts: posts.length,
      reels: reels,
      media: media,
      captions: captions,
      hashtags: [...new Set(hashtags)], // Remove duplicates
      insights: insights,
      lastSync: new Date().toISOString(),
    };

    // Update stored data
    platformDataStore.set(`${userId}_instagram`, {
      ...instagramData,
      ...updatedData,
    });

    return NextResponse.json(updatedData);

  } catch (error) {
    console.error('Instagram data fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch Instagram data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const instagramData = platformDataStore.get(`${userId}_instagram`);

    if (!instagramData || !instagramData.connected) {
      return NextResponse.json({ error: 'Instagram not connected' }, { status: 400 });
    }

    // Refresh data by calling the same logic as GET
    const accessToken = instagramData.accessToken;
    
    // Get user profile
    const profileResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${accessToken}`
    );

    if (!profileResponse.ok) {
      platformDataStore.delete(`${userId}_instagram`);
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

    const updatedData = {
      connected: true,
      username: profileData.username,
      fullName: profileData.username,
      bio: '',
      profilePicture: '',
      followers: 0,
      following: 0,
      posts: posts.length,
      reels: reels,
      media: media,
      captions: captions,
      hashtags: [...new Set(hashtags)],
      lastSync: new Date().toISOString(),
    };

    // Update stored data
    platformDataStore.set(`${userId}_instagram`, {
      ...instagramData,
      ...updatedData,
    });

    return NextResponse.json(updatedData);

  } catch (error) {
    console.error('Instagram refresh error:', error);
    return NextResponse.json({ error: 'Failed to refresh Instagram data' }, { status: 500 });
  }
} 