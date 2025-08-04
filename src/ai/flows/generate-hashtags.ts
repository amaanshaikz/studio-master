
'use server';

/**
 * @fileOverview A hashtag generation AI agent.
 *
 * - generateHashtags - A function that handles the hashtag generation process.
 * - GenerateHashtagsInput - The input type for the generateHashtags function.
 * - GenerateHashtagsOutput - The return type for the generateHashtags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HistoryItemSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const GenerateHashtagsInputSchema = z.object({
  topic: z.string().describe('The topic of the content.'),
  history: z.array(HistoryItemSchema).optional().describe('The previous conversation history.'),
  documentContent: z.string().optional().describe('The content of an attached document to be used as context.'),
  niche: z.string().describe('The specific niche of the content.'),
  location: z.string().optional().describe('A specific country, city, or region to target.'),
  hashtagMix: z.string().optional().describe('The desired mix of hashtags (e.g., Trending, Evergreen).'),
  keywords: z.string().optional().describe('Keywords or topics to always include.'),
  blendStructure: z.boolean().optional().describe('Whether to auto-generate a structured blend of hashtag types (niche, broad, viral, branded).'),
  hashtagGoals: z.array(z.string()).optional().describe('The primary goals for the hashtags.'),
});
export type GenerateHashtagsInput = z.infer<typeof GenerateHashtagsInputSchema>;

const GenerateHashtagsOutputSchema = z.object({
  hashtags: z.array(z.string()).describe('An array of relevant hashtags.'),
  followUpPrompts: z.array(z.string()).describe('Two distinct, relevant follow-up prompts for the user.'),
});
export type GenerateHashtagsOutput = z.infer<typeof GenerateHashtagsOutputSchema>;

export async function generateHashtags(input: GenerateHashtagsInput): Promise<GenerateHashtagsOutput> {
  return generateHashtagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHashtagsPrompt',
  input: {schema: GenerateHashtagsInputSchema},
  output: {schema: GenerateHashtagsOutputSchema},
  prompt: `You are CreateX AI, an expert in social media marketing with a friendly and encouraging personality. Your specialty is finding the perfect hashtags to boost content visibility. Your response must be comprehensive and sufficient. Start your response with a positive affirmation before providing the hashtags.

Your response should be structured and clear.

{{#if history}}
**Conversation History:**
The user and you have been discussing the following. Use this as context for your response.
{{#each history}}
- **{{role}}**: {{content}}
{{/each}}
---
{{/if}}

Great topic! Let's find the perfect hashtags to get more eyes on your content. Here is a comprehensive list of suggestions based on your criteria.

**Generation Criteria:**
*   **Topic:** {{{topic}}}
*   **Niche:** {{{niche}}}
{{#if documentContent}}
*   **Context Document:** The user has provided a document for additional context. Use it as the primary source of information.
{{/if}}
{{#if hashtagGoals}}
*   **Primary Hashtag Goal(s):** {{#each hashtagGoals}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}. Please tailor the hashtag suggestions to meet these specific goals.
{{/if}}
{{#if location}}
*   **Geo/Location Target:** {{{location}}}
{{/if}}
{{#if hashtagMix}}
*   **Hashtag Mix:** Prioritize {{{hashtagMix}}} tags.
{{/if}}
{{#if keywords}}
*   **Include these Keywords:** {{{keywords}}}
{{/if}}
{{#if blendStructure}}
*   **Custom Blend Structure:** Generate a strategic blend of 5 niche-specific, 5 broad category, 5 viral/trending, and 3 branded hashtags.
{{/if}}

---

**Task:**
Please provide a generous list of hashtags that are most relevant to the provided criteria. If providing a blend, use headings for each category (e.g., ## Niche-Specific, ## Broad, etc.).

Finally, provide two distinct, relevant follow-up prompts. These prompts should be phrased from the user's perspective, as if they are commands the user would type next. For example: "Now create a caption for this topic" or "Give me some trending audio ideas for this".
`,
});

const generateHashtagsFlow = ai.defineFlow(
  {
    name: 'generateHashtagsFlow',
    inputSchema: GenerateHashtagsInputSchema,
    outputSchema: GenerateHashtagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
