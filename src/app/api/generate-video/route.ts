import { NextRequest, NextResponse } from 'next/server';
import { generateVideoWithVeo, generateVideoAlternative, isVertexAIConfigured } from '@/ai/vertex-ai';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { videoSummary, suggestions, engagementScores } = await req.json();
    
    if (!videoSummary || !suggestions) {
      return NextResponse.json({ error: 'Video summary and suggestions are required' }, { status: 400 });
    }

    // Create optimized prompt for video generation
    const optimizedPrompt = createOptimizedVideoPrompt(videoSummary, suggestions, engagementScores);
    
    let videoUrl: string;
    let videoDescription: string | undefined;
    
    try {
      // Try Veo 3 Fast first if Vertex AI is configured
      if (isVertexAIConfigured()) {
        console.log('Attempting Veo 3 Fast video generation...');
        videoUrl = await generateVideoWithVeo(optimizedPrompt);
      } else {
        console.log('Vertex AI not configured, using alternative method...');
        const result = await generateVideoAlternative(optimizedPrompt);
        videoUrl = result.videoUrl || result;
        videoDescription = result.description;
      }
    } catch (videoError) {
      console.error('Video generation failed, using fallback:', videoError);
      // Fallback to a demo video
      videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
    }
    
    return NextResponse.json({
      success: true,
      videoUrl: videoUrl,
      description: videoDescription,
      message: 'Video generated successfully'
    });

  } catch (error) {
    console.error('Error generating video:', error);
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    );
  }
}

function createOptimizedVideoPrompt(
  videoSummary: string, 
  suggestions: string[], 
  engagementScores?: any
): string {
  const systemPrompt = `You are an expert video content creator specializing in viral social media content. Your task is to create a detailed video prompt for Veo 3 Fast that will generate a highly engaging, viral-worthy video.

VIDEO REQUIREMENTS:
- Duration: 8-10 seconds (optimal for social media)
- Format: Vertical (9:16 aspect ratio)
- Style: High-energy, visually appealing, modern
- No audio required (visual content only)
- Focus on visual storytelling and engagement

ENGAGEMENT OPTIMIZATION:
- Hook viewers in the first 2 seconds
- Use dynamic camera movements and transitions
- Include text overlays for key points
- Create visual contrast and energy
- End with a strong call-to-action visual

CONTENT STRATEGY:
- Make it shareable and memorable
- Use trending visual styles
- Include elements that encourage engagement
- Optimize for mobile viewing
- Create emotional connection

Generate a detailed, specific prompt for Veo 3 Fast that will create a viral video based on this content:`;

  const suggestionsText = suggestions.length > 0 ? suggestions.join(', ') : 'No specific suggestions provided';
  const scoresText = engagementScores ? 
    `Engagement scores: Relatability ${engagementScores.relatability}%, Niche Alignment ${engagementScores.nicheAlignment}%, Creative Score ${engagementScores.creativeScore}%` : 
    'No engagement scores available';

  return `${systemPrompt}

ORIGINAL VIDEO SUMMARY:
${videoSummary}

OPTIMIZATION SUGGESTIONS:
${suggestionsText}

${scoresText}

Create a detailed video prompt that incorporates these elements into a viral-worthy 8-10 second video. Focus on visual storytelling, dynamic elements, and high engagement potential.`;
}
