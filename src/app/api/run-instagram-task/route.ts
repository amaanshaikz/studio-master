
import { NextRequest, NextResponse } from 'next/server';
import { createInstagramAnalysisTask, getTaskRunStatus, getTaskRunResult, getParallelAPIKeyStatus } from '@/lib/parallel-api';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@/lib/auth';
import { CreatorIntelligenceData } from '@/types/creator-intelligence';
import { CreateCreatorRecord } from '@/types/creator-database';
import { mapCreatorDataToDatabase, validateCreatorData } from '@/lib/creator-data-mapper';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { instagram_url } = await req.json();
    
    if (!instagram_url) {
      return NextResponse.json({ error: 'Instagram URL is required' }, { status: 400 });
    }

    // Validate Instagram URL format
    const instagramUrlPattern = /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/;
    if (!instagramUrlPattern.test(instagram_url)) {
      return NextResponse.json({ error: 'Invalid Instagram URL format' }, { status: 400 });
    }

    // Extract username from Instagram URL
    const usernameMatch = instagram_url.match(/instagram\.com\/([^\/\?]+)/);
    if (!usernameMatch) {
      return NextResponse.json({ error: 'Could not extract username from URL' }, { status: 400 });
    }
    const username = usernameMatch[1];

    // Check if creator profile already exists (by instagram_url)
    const { data: existingCreator } = await supabase
      .from('creatorsprofile')
      .select('id')
      .eq('instagram_url', instagram_url)
      .single();

    if (existingCreator) {
      return NextResponse.json({ 
        status: 'success', 
        message: 'Creator profile already exists',
        creator_id: existingCreator.id
      });
    }

    // Check Parallel API configuration
    const apiKeyStatus = getParallelAPIKeyStatus();
    console.log('🔑 [API ROUTE] Parallel API Key Status:', apiKeyStatus);
    console.log('📊 [API ROUTE] Supabase URL configured:', !!supabaseUrl);
    console.log('🔐 [API ROUTE] Supabase Service Key configured:', !!supabaseServiceKey);
    
    if (!apiKeyStatus.configured) {
      return NextResponse.json({ 
        error: 'Parallel API key not configured. Please set PARALLEL_API_KEY environment variable.' 
      }, { status: 500 });
    }

    // Start Parallel API task
    console.log('🚀 [API ROUTE] Starting Parallel API task for:', instagram_url);
    const taskRun = await createInstagramAnalysisTask(instagram_url);
    console.log('✅ [API ROUTE] Task created successfully:', taskRun.run_id);
    
    // Return task ID for polling
    return NextResponse.json({
      status: 'queued',
      task_id: taskRun.run_id,
      message: 'Analysis started successfully'
    });

  } catch (error) {
    console.error('Error starting Instagram analysis:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: error
    });
    return NextResponse.json(
      { 
        error: 'Failed to start Instagram analysis',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('task_id');
    const instagramUrl = searchParams.get('instagram_url');
    
    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    if (!instagramUrl) {
      return NextResponse.json({ error: 'Instagram URL is required' }, { status: 400 });
    }

    // Get task status from Parallel API
    console.log('🔍 [API ROUTE] Checking task status for:', taskId);
    const taskRun = await getTaskRunStatus(taskId);
    console.log('📊 [API ROUTE] Task status:', taskRun.status);
    console.log('⚡ [API ROUTE] Task is active:', taskRun.is_active);
    
    if (taskRun.status === 'completed') {
      // Get the detailed result
      console.log('📋 [API ROUTE] Getting task result for:', taskId);
      const taskResult = await getTaskRunResult(taskId);
      console.log('✅ [API ROUTE] Task result received');
      
      if (!taskResult.output) {
        console.log('❌ [API ROUTE] No output data in task result');
        return NextResponse.json({
          status: 'failed',
          message: 'No output data received from Parallel API'
        });
      }

      // Parse the result content
      console.log('🔍 [API ROUTE] Parsing creator data from result');
      let creatorData: CreatorIntelligenceData;
      try {
        creatorData = typeof taskResult.output.content === 'string' 
          ? JSON.parse(taskResult.output.content) 
          : taskResult.output.content;
        console.log('✅ [API ROUTE] Creator data parsed successfully');
        console.log('📊 [API ROUTE] Creator data keys:', Object.keys(creatorData));
      } catch (parseError) {
        console.error('❌ [API ROUTE] Error parsing creator data:', parseError);
        return NextResponse.json({
          status: 'failed',
          message: 'Failed to parse creator data'
        });
      }

      // Validate the creator data structure
      console.log('🔍 [API ROUTE] Validating creator data structure');
      if (!validateCreatorData(creatorData)) {
        console.error('❌ [API ROUTE] Invalid creator data structure:', creatorData);
        return NextResponse.json({
          status: 'failed',
          message: 'Invalid creator data structure'
        });
      }
      console.log('✅ [API ROUTE] Creator data validation passed');

      // Map Parallel API response to database columns
      console.log('🔄 [API ROUTE] Mapping creator data to database format');
      const creatorRecord = mapCreatorDataToDatabase(creatorData, instagramUrl);
      console.log('📊 [API ROUTE] Mapped creator record keys:', Object.keys(creatorRecord));

      // Add user_id to the creator record
      creatorRecord.user_id = session.user.id;
      console.log('👤 [API ROUTE] Added user_id to creator record:', session.user.id);

      // Save to Supabase
      console.log('💾 [API ROUTE] Saving creator data to Supabase');
      console.log('🔗 [API ROUTE] Supabase URL:', supabaseUrl);
      const { data: creator, error: insertError } = await supabase
        .from('creatorsprofile')
        .insert(creatorRecord)
        .select('id')
        .single();

      if (insertError) {
        console.error('❌ [API ROUTE] Error saving creator data to Supabase:', insertError);
        console.error('📊 [API ROUTE] Insert error details:', JSON.stringify(insertError, null, 2));
        return NextResponse.json({
          status: 'failed',
          message: 'Failed to save creator data'
        });
      }
      console.log('✅ [API ROUTE] Creator data saved to Supabase successfully');
      console.log('🆔 [API ROUTE] Created creator ID:', creator.id);

      return NextResponse.json({
        status: 'completed',
        creator_id: creator.id,
        result: creatorData,
        basis: taskResult.output.basis // Include research basis for transparency
      });
    }

    if (taskRun.status === 'failed') {
      return NextResponse.json({
        status: 'failed',
        message: taskRun.errors?.[0]?.message || 'Task failed'
      });
    }

    // Return current status
    return NextResponse.json({
      status: taskRun.status,
      message: getStatusMessage(taskRun.status)
    });

  } catch (error) {
    console.error('Error checking task status:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: error
    });
    return NextResponse.json(
      { 
        error: 'Failed to check task status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function getStatusMessage(status: string): string {
  switch (status) {
    case 'queued':
      return 'Task is queued and waiting to start...';
    case 'running':
      return 'Analyzing Instagram profile...';
    case 'completed':
      return 'Analysis completed successfully!';
    case 'failed':
      return 'Analysis failed. Please try again.';
    default:
      return 'Unknown status';
  }
}
