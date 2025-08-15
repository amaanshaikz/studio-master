import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user data from the users table
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, emailverified, createdat, role')
      .eq('id', session.user.id)
      .single();
    
    if (error || !user) {
      console.error('User fetch error:', error);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return user data
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailverified,
      createdAt: user.createdat,
      role: user.role
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 