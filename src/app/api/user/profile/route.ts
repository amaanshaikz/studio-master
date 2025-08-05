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

    // Fetch user data from Supabase Auth (not a separate users table)
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(session.user.id);
    
    if (authError) {
      console.error('Supabase auth error:', authError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Extract user data from auth metadata
    const userData = {
      id: authUser.user.id,
      email: authUser.user.email || '',
      full_name: authUser.user.user_metadata?.full_name || authUser.user.user_metadata?.name || null,
      created_at: authUser.user.created_at
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 