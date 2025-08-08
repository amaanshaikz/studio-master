import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('email', email)
      .single();

    if (userError || !user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { success: true, message: 'If an account exists, a reset link has been sent' },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store reset token in database
    const { error: tokenError } = await supabase
      .from('password_reset_tokens')
      .upsert({
        userId: user.id,
        token: resetToken,
        expiresAt: resetTokenExpiry.toISOString(),
      });

    if (tokenError) {
      console.error('Token storage error:', tokenError);
      return NextResponse.json(
        { error: 'Failed to process reset request' },
        { status: 500 }
      );
    }

    // In a real application, you would send an email here
    // For now, we'll just return success
    console.log('Password reset token generated:', resetToken);
    console.log('Reset URL would be:', `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`);

    return NextResponse.json(
      { 
        success: true, 
        message: 'If an account exists, a reset link has been sent' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
