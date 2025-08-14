import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PlatformDatabase } from '@/lib/platform-database';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      console.error('LinkedIn OAuth: No authenticated user');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      console.error('LinkedIn OAuth error:', { error, errorDescription });
      return NextResponse.redirect(new URL(`/account?error=linkedin_auth_failed&reason=${error}`, request.url));
    }

    if (!code) {
      console.error('LinkedIn OAuth: No authorization code received');
      return NextResponse.redirect(new URL('/account?error=no_code', request.url));
    }

    console.log('LinkedIn OAuth: Exchanging code for access token');

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
      const errorText = await tokenResponse.text();
      console.error('LinkedIn token exchange failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorText
      });
      return NextResponse.redirect(new URL('/account?error=token_exchange_failed', request.url));
    }

    const tokenData = await tokenResponse.json();
    const { access_token, expires_in } = tokenData;

    if (!access_token) {
      console.error('LinkedIn OAuth: Missing access_token in response:', tokenData);
      return NextResponse.redirect(new URL('/account?error=invalid_token_response', request.url));
    }

    console.log('LinkedIn OAuth: Successfully obtained access token');

    // Get user profile
    const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text();
      console.error('LinkedIn profile fetch failed:', {
        status: profileResponse.status,
        statusText: profileResponse.statusText,
        error: errorText
      });
      return NextResponse.redirect(new URL('/account?error=profile_fetch_failed', request.url));
    }

    const profileData = await profileResponse.json();
    console.log('LinkedIn OAuth: Retrieved profile data:', profileData);

    // Get additional profile information
    let email = '';
    try {
      const emailResponse = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });

      if (emailResponse.ok) {
        const emailData = await emailResponse.json();
        email = emailData.elements?.[0]?.['handle~']?.emailAddress || '';
      }
    } catch (emailError) {
      console.warn('LinkedIn OAuth: Could not fetch email:', emailError);
    }

    // Calculate token expiration
    const tokenExpiresAt = expires_in ? new Date(Date.now() + expires_in * 1000) : undefined;

    // Save connection to database
    try {
      const connection = await PlatformDatabase.upsertConnection(
        session.user.id,
        'linkedin',
        profileData.id,
        access_token,
        undefined, // LinkedIn doesn't provide refresh tokens in this flow
        tokenExpiresAt,
        { ...profileData, email }
      );

      // Save LinkedIn-specific data
      await PlatformDatabase.upsertLinkedInData(
        session.user.id,
        connection.id,
        profileData.id,
        {
          linkedin_user_id: profileData.id,
          first_name: profileData.localizedFirstName,
          last_name: profileData.localizedLastName,
          email: email,
        }
      );

      console.log('LinkedIn OAuth: Successfully saved connection to database');
      return NextResponse.redirect(new URL('/account?success=linkedin_connected', request.url));

    } catch (dbError) {
      console.error('LinkedIn OAuth: Database error:', dbError);
      return NextResponse.redirect(new URL('/account?error=database_error', request.url));
    }

  } catch (error) {
    console.error('LinkedIn OAuth callback error:', error);
    return NextResponse.redirect(new URL('/account?error=callback_error', request.url));
  }
} 