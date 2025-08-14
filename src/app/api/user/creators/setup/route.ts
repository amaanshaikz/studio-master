import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET - Fetch creator profile setup data
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      console.error('No session or user ID found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching creator data for user:', session.user.id);

    const { data: creator, error } = await supabase
      .from('creators')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (error) {
      console.error('Creator fetch error:', error);
      if (error.code === 'PGRST116') { // PGRST116 = no rows returned
        return NextResponse.json({ user_id: session.user.id });
      }
      return NextResponse.json({ error: 'Failed to fetch creator profile' }, { status: 500 });
    }

    return NextResponse.json(creator);
  } catch (error) {
    console.error('Creator setup GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST/PUT - Create or update creator profile setup data
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      console.error('No session or user ID found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { step, data, isComplete } = body;

    console.log('Saving creator data for user:', session.user.id, 'step:', step);

    // Prepare the update data
    const updateData = {
      user_id: session.user.id,
      
      // SECTION 1: CREATOR PROFILE & BRAND
      full_name: data.full_name ?? null,
      age: data.age ?? null,
      location: data.location ?? null,
      primary_language: data.primary_language ?? null,
      
      platforms: data.platforms ?? null,
      main_focus_platform: data.main_focus_platform ?? null,
      other_platforms: data.other_platforms ?? null,
      
      primary_niche: data.primary_niche ?? null,
      sub_niche: data.sub_niche ?? null,
      target_audience: data.target_audience ?? null,
      other_niche: data.other_niche ?? null,
      other_target_audience: data.other_target_audience ?? null,
      
      brand_words: data.brand_words ?? null,
      tone_style: data.tone_style ?? null,
      
      total_followers: data.total_followers ?? null,
      average_views: data.average_views ?? null,
      
      // SECTION 2: CONTENT STYLE & CREATIVE DIRECTION
      content_formats: data.content_formats ?? null,
      typical_length_number: data.typical_length_number ?? null,
      typical_length_unit: data.typical_length_unit ?? null,
      other_formats: data.other_formats ?? null,
      
      on_camera: data.on_camera ?? null,
      use_voiceovers: data.use_voiceovers ?? null,
      editing_music_style: data.editing_music_style ?? null,
      
      short_term_goals: data.short_term_goals ?? null,
      long_term_goals: data.long_term_goals ?? null,
      
      posting_frequency: data.posting_frequency ?? null,
      posting_schedule: data.posting_schedule ?? null,
      
      biggest_challenge: data.biggest_challenge ?? null,
      
      // SECTION 3: GROWTH, MONETIZATION & AI PERSONALIZATION
      strengths: data.strengths ?? null,
      weaknesses: data.weaknesses ?? null,
      
      income_streams: data.income_streams ?? null,
      brand_types_to_avoid: data.brand_types_to_avoid ?? null,
      
      ai_help_preferences: data.ai_help_preferences ?? null,
      
      niche_focus: data.niche_focus ?? null,
      content_style: data.content_style ?? null,
      
      non_negotiable_rules: data.non_negotiable_rules ?? null,
      
      current_step: step,
      is_setup_complete: isComplete || false,
      updated_at: new Date().toISOString(),
    };

    console.log('Update data prepared:', updateData);

    // Upsert the creator data
    const { data: creator, error } = await supabase
      .from('creators')
      .upsert(updateData, {
        onConflict: 'user_id',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Creator update error:', error);
      return NextResponse.json({ 
        error: 'Failed to update creator profile',
        details: error.message 
      }, { status: 500 });
    }

    console.log('Creator data saved successfully:', creator);

    return NextResponse.json({
      success: true,
      creator,
      message: isComplete ? 'Creator profile setup completed!' : 'Creator profile updated successfully'
    });

  } catch (error) {
    console.error('Creator setup POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
