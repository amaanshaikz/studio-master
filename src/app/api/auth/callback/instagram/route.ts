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
      console.error('Instagram OAuth error:', error);
      return NextResponse.redirect(new URL('/account?error=instagram_auth_failed', request.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL('/account?error=no_code', request.url));
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_CLIENT_ID!,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/instagram`,
        code: code,
      }),
    });

    if (!tokenResponse.ok) {
      console.error('Instagram token exchange failed:', await tokenResponse.text());
      return NextResponse.redirect(new URL('/account?error=token_exchange_failed', request.url));
    }

    const tokenData = await tokenResponse.json();
    const { access_token, user_id } = tokenData;

    // Get user profile
    const profileResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${access_token}`
    );

    if (!profileResponse.ok) {
      console.error('Instagram profile fetch failed:', await profileResponse.text());
      return NextResponse.redirect(new URL('/account?error=profile_fetch_failed', request.url));
    }

    const profileData = await profileResponse.json();

    // Store the access token and user data in your database
    // For now, we'll store it in a simple way - in production, use your database
    const platformData = {
      userId: session.user.id,
      platform: 'instagram',
      accessToken: access_token,
      platformUserId: user_id,
      username: profileData.username,
      connected: true,
      lastSync: new Date().toISOString(),
    };

    // Store in Supabase or your preferred database
    // This is a simplified version - implement proper database storage
    console.log('Instagram platform data:', platformData);

    // Redirect back to account page with success
    return NextResponse.redirect(new URL('/account?success=instagram_connected', request.url));

  } catch (error) {
    console.error('Instagram callback error:', error);
    return NextResponse.redirect(new URL('/account?error=callback_error', request.url));
  }
} 