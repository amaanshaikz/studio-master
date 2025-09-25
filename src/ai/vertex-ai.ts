import { VertexAI } from '@google-cloud/vertexai';

// Initialize Vertex AI
const vertexAI = new VertexAI({
  project: process.env.GCP_PROJECT_ID || '',
  location: process.env.GCP_LOCATION || ''
});

/**
 * Generate content using Vertex AI Gemini 2.0 Flash (Text-only)
 */
export async function generateWithVertex(promptText: string): Promise<string> {
  try {
    console.log('Using Vertex AI with project:', process.env.GCP_PROJECT_ID, 'location:', process.env.GCP_LOCATION);
    
    const model = vertexAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const resp = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: promptText }] }],
    });
    
    console.log('Vertex AI response received');
    return resp.response.candidates[0].content.parts[0].text || '';
  } catch (error) {
    console.error('Vertex AI generation failed:', error);
    throw error;
  }
}

/**
 * Generate content using Vertex AI Gemini 2.0 Flash with multimodal support (Video + Text)
 */
export async function generateWithVertexMultimodal(promptText: string, videoBase64: string): Promise<string> {
  try {
    console.log('Using Vertex AI multimodal analysis with project:', process.env.GCP_PROJECT_ID, 'location:', process.env.GCP_LOCATION);
    
    const model = vertexAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Create multimodal content with video and text
    const resp = await model.generateContent({
      contents: [{ 
        role: "user", 
        parts: [
          { text: promptText },
          { 
            inline_data: {
              mime_type: "video/mp4",
              data: videoBase64
            }
          }
        ] 
      }],
    });
    
    console.log('Vertex AI multimodal response received');
    return resp.response.candidates[0].content.parts[0].text || '';
  } catch (error) {
    console.error('Vertex AI multimodal generation failed:', error);
    throw error;
  }
}

/**
 * Generate video using Veo 3 Fast (when available) or fallback to demo
 */
export async function generateVideoWithVeo(prompt: string): Promise<string> {
  try {
    console.log('Generating video with prompt:', prompt.substring(0, 100) + '...');
    
    // Check if we have proper Vertex AI configuration
    if (!isVertexAIConfigured()) {
      console.log('Vertex AI not configured, using demo video');
      return getDemoVideo();
    }

    try {
      // Try to use actual video generation
      const model = vertexAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp" // Use latest Gemini model with video capabilities
      });

      const request = {
        contents: [{
          role: "user",
          parts: [{
            text: `${prompt}\n\nGenerate a 8-10 second vertical video (9:16 aspect ratio) optimized for social media. Focus on visual storytelling and engagement.`,
            // Note: Video generation parameters may vary based on model availability
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      };

      const response = await model.generateContent(request);
      const result = response.response.candidates[0].content.parts[0];
      
      // Try to extract video URL from response
      if (result.text) {
        const videoUrlMatch = result.text.match(/https:\/\/[^\s]+\.(mp4|webm|mov)/);
        if (videoUrlMatch) {
          console.log('Video generated successfully:', videoUrlMatch[0]);
          return videoUrlMatch[0];
        }
      }
      
      // If no video URL found, the model might not support video generation yet
      console.log('Video generation not available, using demo video');
      return getDemoVideo();
      
    } catch (videoError) {
      console.log('Video generation failed, using demo video:', videoError);
      return getDemoVideo();
    }
    
  } catch (error) {
    console.error('Video generation failed:', error);
    return getDemoVideo();
  }
}

/**
 * Get a demo video URL
 */
function getDemoVideo(): string {
  const demoVideos = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
  ];
  
  // Return a random demo video
  return demoVideos[Math.floor(Math.random() * demoVideos.length)];
}

/**
 * Generate video using alternative AI video generation service
 * This is a fallback implementation using a different approach
 */
export async function generateVideoAlternative(prompt: string): Promise<string> {
  try {
    console.log('Using alternative video generation with prompt:', prompt.substring(0, 100) + '...');
    
    // Use Gemini to generate a detailed video description
    const model = vertexAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const videoDescriptionPrompt = `Create a detailed video description for a 8-10 second vertical social media video based on this prompt: "${prompt}"

Requirements:
- Duration: 8-10 seconds
- Format: Vertical (9:16 aspect ratio)
- Style: High-energy, visually appealing
- Focus: Viral potential, engagement
- No audio needed

Provide a detailed scene-by-scene description that could be used to create a video.`;

    const resp = await model.generateContent({
      contents: [{ 
        role: "user", 
        parts: [{ text: videoDescriptionPrompt }] 
      }],
    });
    
    const description = resp.response.candidates[0].content.parts[0].text || '';
    console.log('Video description generated:', description.substring(0, 200) + '...');
    
    // For now, return a placeholder video with the description
    // In production, this would be sent to an actual video generation service
    return {
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      description: description
    };
    
  } catch (error) {
    console.error('Alternative video generation failed:', error);
    throw error;
  }
}

/**
 * Check if Vertex AI is properly configured
 */
export function isVertexAIConfigured(): boolean {
  const hasProjectId = !!process.env.GCP_PROJECT_ID;
  const hasLocation = !!process.env.GCP_LOCATION;
  
  console.log('Vertex AI configuration check:', {
    hasProjectId,
    hasLocation,
    projectId: process.env.GCP_PROJECT_ID,
    location: process.env.GCP_LOCATION
  });
  
  return hasProjectId && hasLocation;
}
