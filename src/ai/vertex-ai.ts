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
