import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PlatformDatabase } from '@/lib/platform-database';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      console.error('Instagram OAuth: No authenticated user');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorReason = searchParams.get('error_reason');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      console.error('Instagram OAuth error:', { error, errorReason, errorDescription });
      return NextResponse.redirect(new URL(`/account?error=instagram_auth_failed&reason=${errorReason || error}`, request.url));
    }

    if (!code) {
      console.error('Instagram OAuth: No authorization code received');
      return NextResponse.redirect(new URL('/account?error=no_code', request.url));
    }

    console.log('Instagram OAuth: Exchanging code for access token');

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
      const errorText = await tokenResponse.text();
      console.error('Instagram token exchange failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorText
      });
      return NextResponse.redirect(new URL('/account?error=token_exchange_failed', request.url));
    }

    const tokenData = await tokenResponse.json();
    const { access_token, user_id } = tokenData;

    if (!access_token || !user_id) {
      console.error('Instagram OAuth: Missing access_token or user_id in response:', tokenData);
      return NextResponse.redirect(new URL('/account?error=invalid_token_response', request.url));
    }

    console.log('Instagram OAuth: Successfully obtained access token for user:', user_id);

    // Get user profile
    const profileResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${access_token}`
    );

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text();
      console.error('Instagram profile fetch failed:', {
        status: profileResponse.status,
        statusText: profileResponse.statusText,
        error: errorText
      });
      return NextResponse.redirect(new URL('/account?error=profile_fetch_failed', request.url));
    }

    const profileData = await profileResponse.json();
    console.log('Instagram OAuth: Retrieved profile data:', profileData);

    // Save connection to database
    try {
      const connection = await PlatformDatabase.upsertConnection(
        session.user.id,
        'instagram',
        user_id,
        access_token,
        undefined, // Instagram Basic Display API doesn't provide refresh tokens
        undefined, // No expiration for Basic Display API tokens
        profileData
      );

      // Save Instagram-specific data
      await PlatformDatabase.upsertInstagramData(
        session.user.id,
        connection.id,
        user_id,
        {
          instagram_user_id: user_id,
          username: profileData.username,
          account_type: profileData.account_type,
        }
      );

      console.log('Instagram OAuth: Successfully saved connection to database');
      return NextResponse.redirect(new URL('/account?success=instagram_connected', request.url));

    } catch (dbError) {
      console.error('Instagram OAuth: Database error:', dbError);
      return NextResponse.redirect(new URL('/account?error=database_error', request.url));
    }

  } catch (error) {
    console.error('Instagram OAuth callback error:', error);
    return NextResponse.redirect(new URL('/account?error=callback_error', request.url));
  }
} 