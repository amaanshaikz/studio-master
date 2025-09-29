import { NextRequest, NextResponse } from 'next/server';
import { isVertexAIConfigured, generateWithVertex, generateWithVertexMultimodal } from '@/ai/vertex-ai';
import { buildCreatorProfileContext, buildInstagramCreatorIntelligenceContext } from '@/ai/creatorProfileContext';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';

// Helper function to extract video frames using FFmpeg
async function extractVideoFrames(videoBuffer: Buffer): Promise<string[]> {
    // For now, we'll use a placeholder approach
    // In production, you'd use FFmpeg to extract frames
    // This is a simplified version for MVP
    
    try {
        // Convert buffer to base64 for multimodal analysis
        const base64Video = videoBuffer.toString('base64');
        
        // For MVP, we'll analyze the video directly using Vertex AI multimodal
        // In a full implementation, you'd extract frames and analyze them
        return [base64Video];
    } catch (error) {
        console.error('Error processing video:', error);
        return [];
    }
}

export async function POST(req: NextRequest) {
    try {
        const form = await req.formData();
        const file = form.get('file') as File | null;
        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Get the current user session
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        // Fetch creator profile for personalized analysis
        let creatorProfile: string;
        try {
            creatorProfile = await buildCreatorProfileContext();
            console.log('Creator profile loaded for user:', session.user.id);
            console.log('Profile length:', creatorProfile.length);
            console.log('Profile preview:', creatorProfile.substring(0, 200) + '...');
        } catch (error) {
            console.error('Error loading creator profile:', error);
            creatorProfile = "Creator profile unavailable.";
        }

        // Fetch Instagram Creator Intelligence data for enhanced personalization
        let instagramIntelligence: string;
        try {
            instagramIntelligence = await buildInstagramCreatorIntelligenceContext();
            console.log('Instagram Creator Intelligence loaded for user:', session.user.id);
            console.log('Intelligence data length:', instagramIntelligence.length);
            console.log('Intelligence preview:', instagramIntelligence.substring(0, 200) + '...');
        } catch (error) {
            console.error('Error loading Instagram Creator Intelligence:', error);
            instagramIntelligence = "Instagram Creator Intelligence unavailable.";
        }
        
        // Check if Instagram Intelligence is available, if not use creator profile as fallback
        const hasInstagramIntelligence = instagramIntelligence !== "Instagram Creator Intelligence unavailable." && 
                                       instagramIntelligence.length > 100 && 
                                       !instagramIntelligence.includes('Instagram Creator Intelligence profile unavailable');
        
        if (!hasInstagramIntelligence) {
            console.log('⚠️ [VIDEO ANALYSIS] Instagram Intelligence not available, using creator profile as fallback');
            if (creatorProfile && creatorProfile !== "Creator profile unavailable." && creatorProfile.length > 100) {
                instagramIntelligence = `**CREATOR PROFILE FALLBACK (Instagram Intelligence Unavailable):**\n\n${creatorProfile}\n\n*Note: This is basic creator profile data. For enhanced Instagram-specific insights, complete your Instagram connection and analysis.*`;
            } else {
                instagramIntelligence = "**CREATOR PROFILE FALLBACK:**\n\nCreator profile unavailable. Please complete your creator onboarding to get personalized assistance.\n\n*Note: For enhanced Instagram-specific insights, complete your Instagram connection and analysis.*";
            }
        }
        
        // Validate profile data for personalization
        const hasProfileData = creatorProfile !== "Creator profile unavailable." && 
                              creatorProfile.length > 100 && 
                              !creatorProfile.includes('NOTE: Creator profile setup incomplete');
        
        // Check if we have Instagram Intelligence (not fallback)
        const hasRealInstagramIntelligence = instagramIntelligence !== "Instagram Creator Intelligence unavailable." && 
                                           instagramIntelligence.length > 100 && 
                                           !instagramIntelligence.includes('Instagram Creator Intelligence profile unavailable') &&
                                           !instagramIntelligence.includes('CREATOR PROFILE FALLBACK');
        
        if (!hasProfileData) {
            console.warn('⚠️ Limited creator profile data - analysis may be less personalized');
            console.warn('Profile content:', creatorProfile);
            console.warn('Profile length:', creatorProfile.length);
            console.warn('Contains "unavailable":', creatorProfile.includes('unavailable'));
            console.warn('Contains "incomplete":', creatorProfile.includes('incomplete'));
        } else {
            console.log('✅ Rich creator profile available for personalized analysis');
        }

        if (!hasRealInstagramIntelligence) {
            console.warn('⚠️ Using creator profile fallback instead of Instagram Creator Intelligence');
            console.log('Fallback content preview:', instagramIntelligence.substring(0, 200) + '...');
        } else {
            console.log('✅ Rich Instagram Creator Intelligence available for enhanced personalization');
        }

        console.log('Video analysis request for file:', file.name, 'Size:', file.size, 'Type:', file.type);

        // Convert file to buffer for processing
        const videoBuffer = Buffer.from(await file.arrayBuffer());
        
        // Extract video content for analysis
        const videoContent = await extractVideoFrames(videoBuffer);
        
        if (videoContent.length === 0) {
            return NextResponse.json({ error: 'Failed to process video content' }, { status: 400 });
        }

        // Create a comprehensive prompt for personalized video analysis
        const prompt = `You are an expert social media content analyst specializing in personalized engagement prediction. Analyze this actual video content and provide detailed insights tailored to this specific creator.

CREATOR PROFILE CONTEXT:
${creatorProfile}

INSTAGRAM CREATOR INTELLIGENCE:
${instagramIntelligence}

CRITICAL: This creator has a specific niche, audience, and performance history. ALL predictions must be calibrated to THEIR specific data, not generic industry averages. Use the Instagram Creator Intelligence data to provide hyper-personalized insights based on their proven content patterns, audience preferences, and performance history.

PERSONALIZED ANALYSIS INSTRUCTIONS:
1. **VISUAL CONTENT**: Analyze what you actually see in the video frames
2. **CONTENT TYPE**: Identify the specific type of content (dance, tutorial, vlog, etc.)
3. **VISUAL ELEMENTS**: Note colors, lighting, composition, editing style
4. **ACTIVITY**: Describe what people/objects are doing
5. **SETTING**: Identify the environment/background
6. **QUALITY**: Assess video quality, resolution, stability
7. **NICHE ALIGNMENT**: Compare content to creator's specific niche and target audience from Instagram Intelligence
8. **PERFORMANCE CALIBRATION**: Use creator's follower count and average views for realistic predictions
9. **BRAND CONSISTENCY**: Compare visual aesthetics to creator's established brand style from Instagram Intelligence
10. **AUDIENCE RESONANCE**: Assess how well content matches creator's actual audience demographics and interests
11. **CONTENT THEME ALIGNMENT**: Compare to creator's proven content themes and successful patterns
12. **ENGAGEMENT PATTERNS**: Use creator's historical engagement data for realistic predictions

MANDATORY PERSONALIZATION REQUIREMENTS:
- Virality Score: Base on creator's niche trends, audience behavior, and proven viral content patterns from Instagram Intelligence
- Relatability: Score based on how well content matches creator's actual audience demographics and interests from Instagram Intelligence
- Niche Alignment: Assess how well content aligns with creator's specific niche, sub-niches, and target audience from Instagram Intelligence
- Visual Appeal: Assess against creator's established visual aesthetics, tone of voice, and brand style from Instagram Intelligence
- Average View Range: MUST be realistic based on creator's follower count, historical performance, and average views status from Instagram Intelligence
- Engagement %: Predict based on creator's actual engagement patterns, overall engagement rate, and audience behavior from Instagram Intelligence
- Aesthetics Score: Compare to creator's proven visual aesthetics, editing techniques, and performance elements from Instagram Intelligence

CONTENT-SPECIFIC ANALYSIS:
- If content matches creator's niche and proven content themes: Higher scores for alignment
- If content differs from creator's niche: Lower scores but suggest niche-specific improvements based on Instagram Intelligence
- Compare content to creator's representative content examples and key content themes from Instagram Intelligence
- Use creator's key hashtags and content patterns for optimization suggestions
- Recommendations must be actionable for THIS creator's specific audience demographics and platform
- Leverage creator's viral content analysis and performance patterns for predictions

Provide the following metrics based on ACTUAL video content AND creator profile:

REQUIRED METRICS:
- Virality Score (0-100): Based on content trends, uniqueness, and shareability
- Audience Relatability % (0-100): How relatable the content is to target audience
- Niche Alignment % (0-100): How well content aligns with creator's specific niche and audience
- Visual Appeal % (0-100): Aesthetic quality, composition, and visual interest
- Average View Range: Realistic view expectations based on content quality
- Engagement % (0-100): Likely engagement rate based on content type
- Aesthetics Score (0-100): Overall visual and production quality

CONTENT ANALYSIS:
- Summary: Detailed description of what's actually happening in the video (2-3 sentences)
- Suggestions: Deliver 5 specific, futuristic recommendations framed as if revealing the hidden levers of the content's performance. Each suggestion must feel like a precise prediction with optimization proof, such as retention improvement, engagement uplift, or resonance boost. Do not use timelines or date-based forecasts. Base recommendations on creator's proven content patterns, audience preferences, and performance history from Instagram Intelligence. Example formats:
  - "This content is strong on emotional pull but weak on call-to-action. Here's a line you can add."
  - "Try trimming first 1.2s intro → boosts reach by +22%."
  - "Most people will drop at 3.4s. Adding text overlay here like 'Wait for the twist' → +18% retention."
  - "Based on your proven content themes, adding [specific element] → +15% engagement with your target audience."
  - "Your audience responds best to [specific style] - incorporate this → +20% relatability score."

Required JSON structure:
{
  "viralityScore": 75,
  "relatability": 80,
  "nicheAlignment": 70,
  "visualAppeal": 85,
  "averageViewRange": "5k–12k views",
  "engagementPercent": 6.2,
  "aestheticsScore": 78,
  "summary": "Detailed description of actual video content",
  "suggestions": "1. First foresight tailored to creator's niche\n2. Second foresight tailored to creator's niche\n3. Third foresight tailored to creator's niche\n4. Fourth foresight tailored to creator's niche\n5. Fifth foresight tailored to creator's niche"
}`;

        let analysisText = '';
        if (isVertexAIConfigured()) {
            console.log('Attempting to use Vertex AI for real video analysis...');
            
            // Use multimodal analysis with actual video content
            try {
                // Use the new multimodal function for real video analysis
                analysisText = await generateWithVertexMultimodal(prompt, videoContent[0]);
                console.log('Raw Vertex AI multimodal response:', analysisText);
            } catch (error) {
                console.error('Vertex AI multimodal analysis failed:', error);
                // Fallback to basic text analysis
                analysisText = await generateWithVertex(`Analyze this video: ${file.name}. ${prompt}`);
            }
        } else {
            console.log('Vertex AI not configured, using personalized fallback data');
            
            // Generate personalized fallback based on creator profile
            let personalizedFallback = {
                viralityScore: 62,
                relatability: 68,
                nicheAlignment: 55,
                visualAppeal: 72,
                averageViewRange: '2k–6k views',
                engagementPercent: 4.1,
                aestheticsScore: 70,
                summary: 'Video analysis requires Vertex AI configuration. Please set up proper credentials for personalized content analysis based on your creator profile.',
                suggestions: '1. Configure Vertex AI credentials for personalized video analysis\n2. Set up GCP project and service account\n3. Enable Vertex AI API\n4. Configure authentication\n5. Implement frame extraction and multimodal analysis with creator profile integration'
            };
            
            // If we have rich profile data, make fallback more personalized
            if (hasProfileData) {
                // Extract key profile elements for personalized fallback
                const hasFollowers = creatorProfile.includes('Followers:') && !creatorProfile.includes('Followers: Not provided');
                const hasNiche = creatorProfile.includes('Niche:') && !creatorProfile.includes('Niche: Not provided');
                const hasPlatform = creatorProfile.includes('Main Focus Platform:') && !creatorProfile.includes('Main Focus Platform: Not provided');
                
                if (hasFollowers && hasNiche && hasPlatform) {
                    personalizedFallback.summary = 'Personalized video analysis requires Vertex AI configuration. Your creator profile shows specific niche and audience data that would be used for tailored predictions.';
                    personalizedFallback.suggestions = '1. Configure Vertex AI for niche-specific video analysis\n2. Set up GCP project and service account\n3. Enable Vertex AI API for personalized predictions\n4. Configure authentication for creator profile integration\n5. Implement multimodal analysis with your specific audience data';
                }
            }

            // If we have Instagram Creator Intelligence data, enhance fallback further
            if (hasRealInstagramIntelligence) {
                // Extract key intelligence elements for enhanced fallback
                const hasInstagramFollowers = instagramIntelligence.includes('Followers:') && !instagramIntelligence.includes('Followers: -');
                const hasInstagramNiche = instagramIntelligence.includes('Primary Niche:') && !instagramIntelligence.includes('Primary Niche: -');
                const hasEngagementData = instagramIntelligence.includes('Overall Engagement Rate:') && !instagramIntelligence.includes('Overall Engagement Rate: -');
                
                if (hasInstagramFollowers && hasInstagramNiche && hasEngagementData) {
                    personalizedFallback.summary = 'Enhanced personalized video analysis requires Vertex AI configuration. Your Instagram Creator Intelligence data shows detailed audience insights, content patterns, and performance history that would be used for hyper-personalized predictions.';
                    personalizedFallback.suggestions = '1. Configure Vertex AI for Instagram Intelligence-powered video analysis\n2. Set up GCP project and service account\n3. Enable Vertex AI API for deep personalization\n4. Configure authentication for Instagram Creator Intelligence integration\n5. Implement multimodal analysis with your proven content patterns and audience data';
                }
            } else if (instagramIntelligence.includes('CREATOR PROFILE FALLBACK')) {
                // Handle creator profile fallback case
                personalizedFallback.summary = 'Personalized video analysis requires Vertex AI configuration. Your creator profile data would be used for tailored predictions based on your niche and audience preferences.';
                personalizedFallback.suggestions = '1. Configure Vertex AI for creator profile-powered video analysis\n2. Set up GCP project and service account\n3. Enable Vertex AI API for personalized predictions\n4. Configure authentication for creator profile integration\n5. Connect Instagram for enhanced intelligence data\n6. Implement multimodal analysis with your creator profile data';
            }
            
            analysisText = JSON.stringify(personalizedFallback);
        }

        // Attempt to parse JSON from model
        let parsed: any;
        try {
            // Handle markdown-wrapped JSON responses from Vertex AI
            let jsonText = analysisText;
            
            // Remove markdown code blocks if present
            if (analysisText.includes('```json')) {
                jsonText = analysisText.replace(/```json\s*/, '').replace(/```\s*$/, '');
            } else if (analysisText.includes('```')) {
                jsonText = analysisText.replace(/```\s*/, '').replace(/```\s*$/, '');
            }
            
            // Clean up any remaining whitespace and newlines
            jsonText = jsonText.trim();
            
            // Fix common JSON issues that cause parsing errors
            // Remove control characters and fix line endings
            jsonText = jsonText
                .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
                .replace(/\r\n/g, '\\n')  // Replace Windows line endings
                .replace(/\r/g, '\\n');   // Replace Mac line endings
            
            // Fix the specific issue: unescaped quotes within JSON string values
            // This handles cases like: "For example, \"What's your study buddy of choice?\" to increase engagement."
            jsonText = jsonText.replace(/"([^"]*)"([^"]*)"([^"]*)"/g, (match, p1, p2, p3) => {
                // If this looks like a string value with unescaped quotes, fix it
                if (p2.includes('"') && !p2.includes('\\"')) {
                    return `"${p1}\\"${p2.replace(/"/g, '\\"')}\\"${p3}"`;
                }
                return match;
            });
            
            console.log('Cleaned JSON text:', jsonText);
            parsed = JSON.parse(jsonText);
            console.log('Successfully parsed analysis result:', parsed);
        } catch (parseError) {
            console.error('Failed to parse analysis result, using fallback:', parseError);
            console.error('Raw response was:', analysisText);
            // If model returned text, extract naive numbers as fallback
            parsed = {
                viralityScore: 60,
                relatability: 60,
                nicheAlignment: 60,
                visualAppeal: 60,
                averageViewRange: '1k–5k views',
                engagementPercent: 3.5,
                aestheticsScore: 60,
                summary: 'Video analysis failed. Please check Vertex AI configuration and try again for personalized analysis.',
                suggestions: '1. Verify Vertex AI credentials for personalized analysis\n2. Check API permissions\n3. Ensure video format is supported\n4. Try with a different video file\n5. Contact support if issue persists'
            };
        }

        return NextResponse.json({
            scores: {
                viralityScore: Number(parsed.viralityScore) || 0,
                relatability: Number(parsed.relatability) || 0,
                nicheAlignment: Number(parsed.nicheAlignment) || 0,
                visualAppeal: Number(parsed.visualAppeal) || 0,
                averageViewRange: String(parsed.averageViewRange || ''),
                engagementPercent: Number(parsed.engagementPercent) || 0,
                aestheticsScore: Number(parsed.aestheticsScore) || 0,
            },
            transcript: '', // transcript extraction not implemented in MVP
            summary: String(parsed.summary || ''),
            suggestions: String(parsed.suggestions || ''),
            metadata: {
                usedVertexAI: isVertexAIConfigured(),
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                timestamp: new Date().toISOString(),
                analysisType: isVertexAIConfigured() ? 'AI Analysis' : 'Fallback Data',
                note: isVertexAIConfigured() ? 'Real video content analysis attempted' : 'Mock data - configure Vertex AI for real analysis',
                personalizationLevel: hasProfileData ? 'Personalized' : 'Generic',
                creatorProfileUsed: hasProfileData,
                userId: session.user.id
            }
        });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
    }
}


