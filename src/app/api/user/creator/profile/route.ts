import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch creator profile data from the creators table
    const { data: creator, error } = await supabase
      .from('creators')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No creator profile found
        return NextResponse.json({ 
          error: 'Creator profile not found',
          message: 'No creator profile exists for this user'
        }, { status: 404 });
      }
      
      console.error('Creator profile fetch error:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch creator profile',
        details: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      creator,
      message: 'Creator profile fetched successfully'
    });

  } catch (error) {
    console.error('Creator profile fetch error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
