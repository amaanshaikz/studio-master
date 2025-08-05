import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('LinkedIn OAuth error:', error);
      return NextResponse.redirect(new URL('/account?error=linkedin_auth_failed', request.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL('/account?error=no_code', request.url));
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/linkedin`,
      }),
    });

    if (!tokenResponse.ok) {
      console.error('LinkedIn token exchange failed:', await tokenResponse.text());
      return NextResponse.redirect(new URL('/account?error=token_exchange_failed', request.url));
    }

    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;

    // Get user profile
    const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    if (!profileResponse.ok) {
      console.error('LinkedIn profile fetch failed:', await profileResponse.text());
      return NextResponse.redirect(new URL('/account?error=profile_fetch_failed', request.url));
    }

    const profileData = await profileResponse.json();

    // Get additional profile information
    const emailResponse = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    let email = '';
    if (emailResponse.ok) {
      const emailData = await emailResponse.json();
      email = emailData.elements?.[0]?.['handle~']?.emailAddress || '';
    }

    // Store the access token and user data in your database
    const platformData = {
      userId: session.user.id,
      platform: 'linkedin',
      accessToken: access_token,
      platformUserId: profileData.id,
      firstName: profileData.localizedFirstName,
      lastName: profileData.localizedLastName,
      email: email,
      connected: true,
      lastSync: new Date().toISOString(),
    };

    // Store in Supabase or your preferred database
    // This is a simplified version - implement proper database storage
    console.log('LinkedIn platform data:', platformData);

    // Redirect back to account page with success
    return NextResponse.redirect(new URL('/account?success=linkedin_connected', request.url));

  } catch (error) {
    console.error('LinkedIn callback error:', error);
    return NextResponse.redirect(new URL('/account?error=callback_error', request.url));
  }
} 