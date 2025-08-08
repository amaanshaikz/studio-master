import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET - Fetch user profile setup data
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Profile fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }

    return NextResponse.json(profile || { user_id: session.user.id });
  } catch (error) {
    console.error('Profile setup GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST/PUT - Create or update user profile setup data
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { step, data, isComplete } = body;

    // Prepare the update data
    const updateData = {
      user_id: session.user.id,
      // Basic
      full_name: data.full_name ?? null,
      nickname: data.nickname ?? null,
      age: data.age ?? null,
      pronouns: data.pronouns ?? null,
      location: data.location ?? null,
      timezone: data.timezone ?? null,
      languages: data.languages ?? null,
      communication_style: data.communication_style ?? null,
      // Personal
      focus_improvement: data.focus_improvement ?? null,
      motivation: data.motivation ?? null,
      personality_type: data.personality_type ?? null,
      productive_time: data.productive_time ?? null,
      productivity_systems: data.productivity_systems ?? null,
      ai_boundaries: data.ai_boundaries ?? null,
      // Professional
      profession: data.profession ?? null,
      career_study_goals: data.career_study_goals ?? null,
      career_study_goals_notes: data.career_study_goals_notes ?? null,
      tools_used: data.tools_used ?? null,
      work_challenges: data.work_challenges ?? null,
      ai_support_preference: data.ai_support_preference ?? null,
      
      current_step: step,
      is_setup_complete: isComplete || false,
      updated_at: new Date().toISOString(),
    };

    // Upsert the profile data
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .upsert(updateData, {
        onConflict: 'user_id',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      profile,
      message: isComplete ? 'Profile setup completed!' : 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Profile setup POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
