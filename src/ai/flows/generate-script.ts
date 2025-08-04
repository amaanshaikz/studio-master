
'use server';
/**
 * @fileOverview A flow for generating video scripts based on user input.
 *
 * - generateScript - A function that generates a video script.
 * - GenerateScriptInput - The input type for the generateScript function.
 * - GenerateScriptOutput - The return type for the generateScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HistoryItemSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const GenerateScriptInputSchema = z.object({
  topic: z.string().describe('The topic of the video script.'),
  history: z.array(HistoryItemSchema).optional().describe('The previous conversation history.'),
  documentContent: z.string().optional().describe('The content of an attached document to be used as context.'),
  niche: z.string().describe('The niche of the content creator.'),
  hookStyle: z.string().describe('The style of the hook to use in the script.'),
  audienceType: z.string().describe('The target audience for the video.'),
  videoLength: z.string().optional().describe('The desired format and length of the video (e.g., Instagram Reel, Long-form YouTube).'),
  callToAction: z.array(z.string()).optional().describe('The desired calls to action for the script.'),
});
export type GenerateScriptInput = z.infer<typeof GenerateScriptInputSchema>;

const GenerateScriptOutputSchema = z.object({
  script: z.string().describe('The generated video script, formatted with clear sections like "Hook", "Main Content", and "Call to Action".'),
  followUpPrompts: z.array(z.string()).describe('Two distinct, relevant follow-up prompts for the user.'),
});
export type GenerateScriptOutput = z.infer<typeof GenerateScriptOutputSchema>;

export async function generateScript(input: GenerateScriptInput): Promise<GenerateScriptOutput> {
  return generateScriptFlow(input);
}

const generateScriptPrompt = ai.definePrompt({
  name: 'generateScriptPrompt',
  input: {schema: GenerateScriptInputSchema},
  output: {schema: GenerateScriptOutputSchema},
  prompt: `You are CreateX AI, an expert AI scriptwriter who is encouraging and loves helping creators. Your tone should be supportive and interactive. Your response must be a complete and detailed script. Start your response with a positive affirmation about the user's idea before presenting the script.

Your response must be well-structured and easy to read. Use formatting like headings for different sections (e.g., "Hook," "Main Content," "Call to Action") and clear instructions for shots or actions. Do not provide a short or incomplete script.

{{#if history}}
**Conversation History:**
The user and you have been discussing the following. Use this as context for your response.
{{#each history}}
- **{{role}}**: {{content}}
{{/each}}
---
{{/if}}

Excellent topic! This has the potential to be a fantastic video. Let's get a great script ready for you.

**Generation Criteria:**
*   **Topic:** {{{topic}}}
*   **Niche:** {{{niche}}}
*   **Hook Style:** {{{hookStyle}}}
*   **Audience Type:** {{{audienceType}}}
{{#if documentContent}}
*   **Context Document:** The user has provided a document for additional context. Use it as the primary source of information.
{{/if}}
{{#if videoLength}}
*   **Video Format/Length:** {{{videoLength}}}
{{/if}}
{{#if callToAction}}
*   **Call to Action Focus:** {{#each callToAction}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}

---

**Task:**
Generate a comprehensive video script tailored to the creator's needs. The script must be creative, attention-grabbing, and optimized for social media platforms.
The script should be clearly structured with headings for each section (e.g., ## Hook, ## Scene 1, ## Main Content, ## Call to Action). Include suggestions for visuals, camera angles, or on-screen text where appropriate.

Here is the complete video script:

Finally, provide two distinct, relevant follow-up prompts. These prompts should be phrased from the user's perspective, as if they are commands the user would type next. For example: "Now write captions for this script" or "Suggest some trending audio I could use with this video".
  `,
});

const generateScriptFlow = ai.defineFlow(
  {
    name: 'generateScriptFlow',
    inputSchema: GenerateScriptInputSchema,
    outputSchema: GenerateScriptOutputSchema,
  },
  async input => {
    const {output} = await generateScriptPrompt(input);
    return output!;
  }
);
