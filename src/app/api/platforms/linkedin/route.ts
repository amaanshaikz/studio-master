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
    const linkedinData = platformDataStore.get(`${userId}_linkedin`);

    if (!linkedinData || !linkedinData.connected) {
      return NextResponse.json({ connected: false });
    }

    // Fetch fresh data from LinkedIn API
    const accessToken = linkedinData.accessToken;
    
    // Get user profile
    const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    if (!profileResponse.ok) {
      // Token might be expired
      platformDataStore.delete(`${userId}_linkedin`);
      return NextResponse.json({ connected: false });
    }

    const profileData = await profileResponse.json();

    // Get additional profile information
    const emailResponse = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    let email = '';
    if (emailResponse.ok) {
      const emailData = await emailResponse.json();
      email = emailData.elements?.[0]?.['handle~']?.emailAddress || '';
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
    } catch (error) {
      console.log('Profile picture not available');
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
    } catch (error) {
      console.log('About section not available');
    }

    // Get location
    let location = '';
    try {
      const locationResponse = await fetch('https://api.linkedin.com/v2/me?projection=(localizedFirstName,localizedLastName,profilePicture,positions)', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });
      
      if (locationResponse.ok) {
        const locationData = await locationResponse.json();
        // LinkedIn API doesn't directly provide location in basic profile
        // This would require additional API calls for full profile data
      }
    } catch (error) {
      console.log('Location not available');
    }

    const updatedData = {
      connected: true,
      fullName: `${profileData.localizedFirstName} ${profileData.localizedLastName}`,
      firstName: profileData.localizedFirstName,
      lastName: profileData.localizedLastName,
      email: email,
      profilePicture: profilePicture,
      about: about,
      location: location,
      headline: profileData.localizedHeadline || '',
      connections: 0, // LinkedIn API doesn't provide connection count in basic profile
      followers: 0, // LinkedIn API doesn't provide follower count in basic profile
      posts: 0, // LinkedIn API doesn't provide post count in basic profile
      lastSync: new Date().toISOString(),
    };

    // Update stored data
    platformDataStore.set(`${userId}_linkedin`, {
      ...linkedinData,
      ...updatedData,
    });

    return NextResponse.json(updatedData);

  } catch (error) {
    console.error('LinkedIn data fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch LinkedIn data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const linkedinData = platformDataStore.get(`${userId}_linkedin`);

    if (!linkedinData || !linkedinData.connected) {
      return NextResponse.json({ error: 'LinkedIn not connected' }, { status: 400 });
    }

    // Refresh data by calling the same logic as GET
    const accessToken = linkedinData.accessToken;
    
    // Get user profile
    const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    if (!profileResponse.ok) {
      platformDataStore.delete(`${userId}_linkedin`);
      return NextResponse.json({ connected: false });
    }

    const profileData = await profileResponse.json();

    // Get additional profile information
    const emailResponse = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    let email = '';
    if (emailResponse.ok) {
      const emailData = await emailResponse.json();
      email = emailData.elements?.[0]?.['handle~']?.emailAddress || '';
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
    } catch (error) {
      console.log('About section not available');
    }

    const updatedData = {
      connected: true,
      fullName: `${profileData.localizedFirstName} ${profileData.localizedLastName}`,
      firstName: profileData.localizedFirstName,
      lastName: profileData.localizedLastName,
      email: email,
      about: about,
      headline: profileData.localizedHeadline || '',
      connections: 0,
      followers: 0,
      posts: 0,
      lastSync: new Date().toISOString(),
    };

    // Update stored data
    platformDataStore.set(`${userId}_linkedin`, {
      ...linkedinData,
      ...updatedData,
    });

    return NextResponse.json(updatedData);

  } catch (error) {
    console.error('LinkedIn refresh error:', error);
    return NextResponse.json({ error: 'Failed to refresh LinkedIn data' }, { status: 500 });
  }
} 