
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating content ideas.
 *
 * - generateIdeas - A function that generates content ideas based on user input.
 * - GenerateIdeasInput - The input type for the generateIdeas function.
 * - GenerateIdeasOutput - The return type for the generateIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HistoryItemSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const GenerateIdeasInputSchema = z.object({
  topic: z.string().describe('The topic or a description for new ideas.'),
  history: z.array(HistoryItemSchema).optional().describe('The previous conversation history.'),
  documentContent: z.string().optional().describe('The content of an attached document to be used as context.'),
  niche: z.string().describe('The niche of the content creator.'),
  targetPlatform: z.string().describe('The target social media platform (e.g., Instagram, TikTok).'),
  contentGoal: z.string().optional().describe('The primary goal of the content (e.g., Awareness, Engagement, Sales).'),
  audienceType: z.string().optional().describe('The target audience for the ideas (e.g., Gen Z, Entrepreneurs).'),
  contentTones: z.array(z.string()).optional().describe('The desired tones for the content.'),
});
export type GenerateIdeasInput = z.infer<typeof GenerateIdeasInputSchema>;

const GenerateIdeasOutputSchema = z.object({
  ideas: z.array(z.string()).describe('An array of AI-generated content ideas, where each idea is a string.'),
  followUpPrompts: z.array(z.string()).describe('Two distinct, relevant follow-up prompts for the user.'),
});
export type GenerateIdeasOutput = z.infer<typeof GenerateIdeasOutputSchema>;

export async function generateIdeas(input: GenerateIdeasInput): Promise<GenerateIdeasOutput> {
  return generateIdeasFlow(input);
}

const generateIdeasPrompt = ai.definePrompt({
  name: 'generateIdeasPrompt',
  input: {schema: GenerateIdeasInputSchema},
  output: {schema: GenerateIdeasOutputSchema},
  prompt: `You are CreateX AI, an AI brainstorming partner for content creators. You are interactive, encouraging, and love to help with new ideas! Your response must be comprehensive, detailed, and complete. Start your response with an appreciative and enthusiastic tone.

Your response must be well-structured and easy to read. Use formatting like headings, bold text, and bullet points to organize the information clearly.

{{#if history}}
**Conversation History:**
The user and you have been discussing the following. Use this as context for your response.
{{#each history}}
- **{{role}}**: {{content}}
{{/each}}
---
{{/if}}

This is a fantastic topic to explore! I'm excited to brainstorm with you. Here are some creative and detailed content ideas that should work great for your audience.

**Generation Criteria:**
*   **Topic/Description:** {{{topic}}}
*   **Niche:** {{{niche}}}
*   **Target Platform:** {{{targetPlatform}}}
{{#if documentContent}}
*   **Context Document:** The user has provided a document for additional context. Use it as the primary source of information.
{{/if}}
{{#if contentGoal}}
*   **Content Goal:** {{{contentGoal}}}
{{/if}}
{{#if audienceType}}
*   **Target Audience:** {{{audienceType}}}
{{/if}}
{{#if contentTones}}
*   **Content Tone/Style:** {{#each contentTones}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}

---

**Task:**
Return a comprehensive array of at least 3-5 diverse content ideas that would perform well on the specified platform and achieve the stated goal. Structure the ideas as a list. For each idea, provide a title and a brief explanation of why it would be effective.

Finally, provide two distinct, relevant follow-up prompts. These prompts should be phrased from the user's perspective, as if they are commands the user would type next. For example: "Write a script for the first idea" or "Give me 5 more ideas but for a different audience".
`,
});

const generateIdeasFlow = ai.defineFlow(
  {
    name: 'generateIdeasFlow',
    inputSchema: GenerateIdeasInputSchema,
    outputSchema: GenerateIdeasOutputSchema,
  },
  async input => {
    const {output} = await generateIdeasPrompt(input);
    return output!;
  }
);
