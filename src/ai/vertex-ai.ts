import { VertexAI } from '@google-cloud/vertexai';

// Initialize Vertex AI
const vertexAI = new VertexAI({
  project: process.env.GCP_PROJECT_ID,
  location: process.env.GCP_LOCATION
});

/**
 * Generate content using Vertex AI Gemini 2.0 Flash
 */
export async function generateWithVertex(promptText: string): Promise<string> {
  try {
    console.log('Using Vertex AI');
    
    const model = vertexAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const resp = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: promptText }] }],
    });
    
    return resp.response.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Vertex AI generation failed:', error);
    throw error;
  }
}

/**
 * Check if Vertex AI is properly configured
 */
export function isVertexAIConfigured(): boolean {
  return !!(process.env.GCP_PROJECT_ID && process.env.GCP_LOCATION);
}
