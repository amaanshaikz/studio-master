
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a chat response.
 *
 * - generateChatResponse - A function that generates a conversational response.
 * - GenerateChatResponseInput - The input type for the generateChatResponse function.
 * - GenerateChatResponseOutput - The return type for the generateChatResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HistoryItemSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const GenerateChatResponseInputSchema = z.object({
  query: z.string().describe('The user\'s query or message.'),
  history: z.array(HistoryItemSchema).optional().describe('The previous conversation history.'),
  documentContent: z.string().optional().describe('The content of an attached document to be used as context.'),
});
export type GenerateChatResponseInput = z.infer<typeof GenerateChatResponseInputSchema>;

const GenerateChatResponseOutputSchema = z.object({
  response: z.string().describe('The AI-generated chat response.'),
  followUpPrompts: z.array(z.string()).describe('Two distinct, relevant follow-up prompts for the user.'),
});
export type GenerateChatResponseOutput = z.infer<typeof GenerateChatResponseOutputSchema>;

export async function generateChatResponse(input: GenerateChatResponseInput): Promise<GenerateChatResponseOutput> {
  return generateChatResponseFlow(input);
}

const generateChatResponsePrompt = ai.definePrompt({
  name: 'generateChatResponsePrompt',
  input: {schema: GenerateChatResponseInputSchema},
  output: {schema: GenerateChatResponseOutputSchema},
  prompt: `You are CreatexAI, an expert AI assistant for content creators. Your purpose is to help users brainstorm ideas, write scripts, create captions, find hashtags, and answer any questions about content strategy. 

Adopt an interactive, encouraging, and appreciative tone. Start your responses with a warm and supportive opening to build trust and make the user feel valued. For example, "That's a great question!", "I can definitely help with that!", or "Awesome idea!".

Your response must be well-structured, comprehensive, sufficient, and easy to read. Use formatting like headings, bold text, and bullet points to organize the information clearly. Do not give short or incomplete answers.

{{#if history}}
**Conversation History:**
The user and you have been discussing the following. Use this as context for your response.
{{#each history}}
- **{{role}}**: {{content}}
{{/each}}
---
{{/if}}

{{#if documentContent}}
**Context Document:**
The user has provided the following document as context. Use it to inform your response:
---
{{{documentContent}}}
---
{{/if}}

**User Query:** 
{{{query}}}

---

**Task:**
Provide a complete and helpful answer to the user's query.

After your main response, provide two distinct, relevant follow-up prompts. These prompts should be phrased from the user's perspective, as if they are commands the user would type next. For example: "Write a script for this idea" or "Give me 5 captions for this".
`,
});

const generateChatResponseFlow = ai.defineFlow(
  {
    name: 'generateChatResponseFlow',
    inputSchema: GenerateChatResponseInputSchema,
    outputSchema: GenerateChatResponseOutputSchema,
  },
  async input => {
    const {output} = await generateChatResponsePrompt(input);
    return output!;
  }
);
