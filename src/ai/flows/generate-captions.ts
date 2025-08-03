
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating social media captions.
 *
 * - generateCaptions - A function that generates social media captions based on user input.
 * - GenerateCaptionsInput - The input type for the generateCaptions function.
 * - GenerateCaptionsOutput - The return type for the generateCaptions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HistoryItemSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const GenerateCaptionsInputSchema = z.object({
  topic: z.string().describe('The topic or a detailed description of the content.'),
  history: z.array(HistoryItemSchema).optional().describe('The previous conversation history.'),
  documentContent: z.string().optional().describe('The content of an attached document to be used as context.'),
  captionLength: z.string().optional().describe('The desired length of the caption (e.g., Short, Medium, Long).'),
  captionTone: z.string().optional().describe('The desired tone for the caption (e.g., Witty, Motivational, Professional).'),
  hookStyle: z.string().optional().describe('The desired hook style to start the caption (e.g., Ask a Question, Shocking Fact).'),
  platform: z.string().optional().describe('The target social media platform (e.g., Instagram, TikTok).'),
  engagementTrigger: z.string().optional().describe('Specific engagement trigger to add (e.g., "Ask a question", "Encourage shares", "Spark debate", "Build FOMO", "Invite DMs", "Drive comments", "Inspire saves").'),
});
export type GenerateCaptionsInput = z.infer<typeof GenerateCaptionsInputSchema>;

const GenerateCaptionsOutputSchema = z.object({
  captions: z.array(z.string()).describe('An array of AI-generated captions.'),
  followUpPrompts: z.array(z.string()).describe('Two distinct, relevant follow-up prompts for the user.'),
});
export type GenerateCaptionsOutput = z.infer<typeof GenerateCaptionsOutputSchema>;

export async function generateCaptions(input: GenerateCaptionsInput): Promise<GenerateCaptionsOutput> {
  return generateCaptionsFlow(input);
}

const generateCaptionsPrompt = ai.definePrompt({
  name: 'generateCaptionsPrompt',
  input: {schema: GenerateCaptionsInputSchema},
  output: {schema: GenerateCaptionsOutputSchema},
  prompt: `You are CreatexAI, an expert social media assistant with an encouraging and appreciative tone. Your goal is to help creators craft the perfect captions. Your response must be detailed, comprehensive, and complete. Start your response with a positive and supportive message before providing the captions.

Your response should be structured and clear. Use headings and bullet points if it helps with readability.

{{#if history}}
**Conversation History:**
The user and you have been discussing the following. Use this as context for your response.
{{#each history}}
- **{{role}}**: {{content}}
{{/each}}
---
{{/if}}

Let's get some amazing captions ready for your content! Based on what you've provided, here are a few well-crafted options designed to get great engagement.

**Generation Criteria:**
*   **Topic/Content Description:** {{{topic}}}
{{#if documentContent}}
*   **Context Document:** The user has provided a document for additional context. Use it as the primary source of information.
{{/if}}
{{#if platform}}
*   **Platform:** Optimize captions for {{{platform}}}.
{{/if}}
{{#if captionLength}}
*   **Caption Length:** {{{captionLength}}}.
{{/if}}
{{#if captionTone}}
*   **Tone/Voice:** {{{captionTone}}}.
{{/if}}
{{#if hookStyle}}
*   **Hook Style:** Start the caption with a hook based on '{{{hookStyle}}}'.
{{/if}}
{{#if engagementTrigger}}
*   **Engagement Trigger:** Include a call to action that will '{{{engagementTrigger}}}'.
{{/if}}

---

**Task:**
Return an array of at least 3-5 diverse and high-quality captions that are likely to increase engagement. The captions should be diverse in style and length, and strictly adhere to all the criteria provided above.

Finally, provide two distinct, relevant follow-up prompts. These prompts should be phrased from the user's perspective, as if they are commands the user would type next. For example: "Now help me find hashtags for this" or "Rewrite the first caption to be more humorous".
`,
});

const generateCaptionsFlow = ai.defineFlow(
  {
    name: 'generateCaptionsFlow',
    inputSchema: GenerateCaptionsInputSchema,
    outputSchema: GenerateCaptionsOutputSchema,
  },
  async input => {
    const {output} = await generateCaptionsPrompt(input);
    return output!;
  }
);
