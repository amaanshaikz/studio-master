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

    // Get LinkedIn connection from database
    const connection = await PlatformDatabase.getConnection(userId, 'linkedin');
    if (!connection) {
      return NextResponse.json({ connected: false });
    }

    // Get LinkedIn data from database
    const linkedinData = await PlatformDatabase.getLinkedInData(userId);
    if (!linkedinData) {
      return NextResponse.json({ connected: false });
    }

    // Get fresh access token with refresh check
    const accessToken = await TokenRefreshService.getValidAccessToken(userId, 'linkedin');
    if (!accessToken) {
      console.error('LinkedIn API: No valid access token available');
      return NextResponse.json({ connected: false });
    }

    try {
      // Get user profile from LinkedIn API
      const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });

      if (!profileResponse.ok) {
        console.error('LinkedIn API: Profile fetch failed:', {
          status: profileResponse.status,
          statusText: profileResponse.statusText
        });
        
        // Token might be expired or invalid
        await PlatformDatabase.disconnectPlatform(userId, 'linkedin');
        return NextResponse.json({ connected: false });
      }

      const profileData = await profileResponse.json();

      // Get additional profile information
      let email = '';
      try {
        const emailResponse = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
          },
        });

        if (emailResponse.ok) {
          const emailData = await emailResponse.json();
          email = emailData.elements?.[0]?.['handle~']?.emailAddress || '';
        }
      } catch (emailError) {
        console.warn('LinkedIn API: Could not fetch email:', emailError);
      }

      // Get profile picture
      let profilePicture = '';
      try {
        const pictureResponse = await fetch('https://api.linkedin.com/v2/me?projection=(profilePicture(displayImage~:playableStreams))', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
          },
        });

        if (pictureResponse.ok) {
          const pictureData = await pictureResponse.json();
          const displayImage = pictureData.profilePicture?.['displayImage~']?.elements?.[0];
          if (displayImage) {
            profilePicture = displayImage.identifiers?.[0]?.identifier || '';
          }
        }
      } catch (pictureError) {
        console.warn('LinkedIn API: Could not fetch profile picture:', pictureError);
      }

      // Update LinkedIn data in database
      await PlatformDatabase.upsertLinkedInData(
        userId,
        connection.id,
        profileData.id,
        {
          first_name: profileData.localizedFirstName,
          last_name: profileData.localizedLastName,
          email: email,
          profile_picture_url: profilePicture,
        }
      );

      return NextResponse.json({
        connected: true,
        firstName: profileData.localizedFirstName,
        lastName: profileData.localizedLastName,
        fullName: `${profileData.localizedFirstName} ${profileData.localizedLastName}`,
        email: email,
        profilePicture: profilePicture,
        headline: linkedinData.headline,
        summary: linkedinData.summary,
        location: linkedinData.location,
        industry: linkedinData.industry,
        connections: linkedinData.connection_count,
        followers: linkedinData.follower_count,
        publicProfileUrl: linkedinData.public_profile_url,
        lastSync: new Date().toISOString(),
      });

    } catch (apiError) {
      console.error('LinkedIn API error:', apiError);
      return NextResponse.json({ 
        connected: false, 
        error: 'Failed to fetch LinkedIn data' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('LinkedIn platform API error:', error);
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

    // Get LinkedIn connection from database
    const connection = await PlatformDatabase.getConnection(userId, 'linkedin');
    if (!connection) {
      return NextResponse.json({ error: 'LinkedIn not connected' }, { status: 400 });
    }

    // Refresh data by calling the same logic as GET
    const accessToken = await TokenRefreshService.getValidAccessToken(userId, 'linkedin');
    if (!accessToken) {
      return NextResponse.json({ error: 'No valid access token available' }, { status: 400 });
    }

    // Get fresh data from LinkedIn API
    const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    if (!profileResponse.ok) {
      await PlatformDatabase.disconnectPlatform(userId, 'linkedin');
      return NextResponse.json({ connected: false });
    }

    const profileData = await profileResponse.json();

    // Get additional profile information
    let email = '';
    try {
      const emailResponse = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });

      if (emailResponse.ok) {
        const emailData = await emailResponse.json();
        email = emailData.elements?.[0]?.['handle~']?.emailAddress || '';
      }
    } catch (emailError) {
      console.warn('LinkedIn API: Could not fetch email:', emailError);
    }

    // Get about section
    let about = '';
    try {
      const aboutResponse = await fetch('https://api.linkedin.com/v2/me?projection=(localizedHeadline,localizedSummary)', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });

      if (aboutResponse.ok) {
        const aboutData = await aboutResponse.json();
        about = aboutData.localizedSummary || '';
      }
    } catch (aboutError) {
      console.warn('LinkedIn API: Could not fetch about section:', aboutError);
    }

    // Update LinkedIn data in database
    await PlatformDatabase.upsertLinkedInData(
      userId,
      connection.id,
      profileData.id,
      {
        first_name: profileData.localizedFirstName,
        last_name: profileData.localizedLastName,
        email: email,
        headline: profileData.localizedHeadline,
        summary: about,
      }
    );

    return NextResponse.json({
      success: true,
      message: 'LinkedIn data refreshed successfully',
      data: {
        firstName: profileData.localizedFirstName,
        lastName: profileData.localizedLastName,
        fullName: `${profileData.localizedFirstName} ${profileData.localizedLastName}`,
        email: email,
        headline: profileData.localizedHeadline,
        summary: about,
        lastSync: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('LinkedIn platform POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 