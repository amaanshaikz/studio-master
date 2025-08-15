import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { role } = await request.json();

    // Validate role
    if (!role || !['creator', 'individual'].includes(role)) {
      return NextResponse.json({ 
        error: 'Invalid role. Must be either "creator" or "individual"' 
      }, { status: 400 });
    }

    // Update user role in database
    const { data: user, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', session.user.id)
      .select()
      .single();

    if (error) {
      console.error('Role update error:', error);
      return NextResponse.json({ 
        error: 'Failed to update role',
        details: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
        name: user.name
      },
      message: 'Role updated successfully'
    });

  } catch (error) {
    console.error('Role update error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user role from database
    const { data: user, error } = await supabase
      .from('users')
      .select('id, role, email, name')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('Role fetch error:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch role',
        details: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Role fetch error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
