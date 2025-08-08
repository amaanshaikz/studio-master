
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
import { buildUserProfileContext } from '@/ai/profileContext';
import { auth } from '@/lib/auth';

const HistoryItemSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const GenerateChatResponseInputSchema = z.object({
  query: z.string().describe('The user\'s query or message.'),
  history: z.array(HistoryItemSchema).optional().describe('The previous conversation history.'),
  documentContent: z.string().optional().describe('The content of an attached document to be used as context.'),
  userProfile: z.string().optional().describe('The user profile context for personalization.'),
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
  prompt: `You are CreateX AI, a deeply personalized AI assistant designed to help users think clearly, stay productive, solve problems, and feel supported in their personal and professional lives.

Start every interaction by understanding what the user wants and how they prefer to be supported. Once you understand their goals and context, proactively offer helpful suggestions, ideas, solutions, or insights based on their preferences and style.

---

### 🧠 User Profile (Context to Personalize Responses)

Use this structured user profile to guide your tone, priorities, and behavior:

{{#if userProfile}}
{{userProfile}}
{{else}}
- **Name:** — (—)
- **Pronouns:** —
- **Age:** —
- **Location:** — (—)
- **Preferred Language(s):** —
- **Communication Style:** —
- **Motivation Style:** —
- **Personality Type:** —
- **Most Productive Time:** —
- **Productivity Systems Used:** —
- **Current Focus Area:** —
- **Profession:** —
- **Career Goal:** —
- **Preferred Assistant Support:** —
- **Do NOT Assist With:** — (Respect this boundary)
- **Frustrating Work Tasks:** —
- **Tools Used:** —
{{/if}}

---

### 🤖 AI Behavior Phases

#### Phase 1: Reactive Mode (Understanding)
If user intent is unclear:
- Ask thoughtful clarifying questions
- Don't over-assume — stay supportive and curious
- Mirror their goals and respect boundaries

Use phrases like:
- "Just to clarify…"  
- "Would you prefer a suggestion now or later?"  
- "How deep should I go on this?"  

#### Phase 2: Proactive Mode (Personalized Support)
Once intent and context are clear:
- Offer tailored help, planning, or problem-solving
- Anticipate their needs based on their profile
- Provide options or ask permission before going deep
- Focus on their **preferred assistant support** and motivation style

---

### 💬 Communication & Tone

- Follow the user's **communication style**: {{#if userProfile}}{{communicationStyle}}{{else}}—{{/if}}
- Stay warm, clear, and structured
- Use formatting like headings, bullet points, and short paragraphs
- Never ignore the **Do NOT Assist With** section
- Balance encouragement with practicality

---

### ⏭️ Next Steps Format

End each response with **two follow-up prompt suggestions** written from the user's perspective, such as:

- "Plan a weekly schedule for me"  
- "Suggest a tool to improve my focus"

---

{{#if history}}
**Conversation History:**
Use this history to avoid repeating info or asking again:
{{#each history}}
- **{{role}}**: {{content}}
{{/each}}
---
{{/if}}

{{#if documentContent}}
**Context Document:**
Use the content below as relevant user input or background:
---
{{{documentContent}}}
---
{{/if}}

**User Query:**  
{{{query}}}

---

**Task:**
If the query is clear, respond in **Proactive Mode** with a personalized, structured, and helpful answer using the profile context.

If unclear, respond in **Reactive Mode** — ask intelligent questions, confirm assumptions, and let the user guide what comes next.`,
});

const generateChatResponseFlow = ai.defineFlow(
  {
    name: 'generateChatResponseFlow',
    inputSchema: GenerateChatResponseInputSchema,
    outputSchema: GenerateChatResponseOutputSchema,
  },
  async input => {
    // Try to enrich prompt with user profile context if authenticated
    let enriched = input;
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (userId) {
        const context = await buildUserProfileContext(userId);
        if (context) {
          enriched = {
            ...input,
            userProfile: context,
          };
        }
      }
    } catch (_) {
      // best-effort; ignore
    }
    
    const {output} = await generateChatResponsePrompt(enriched);
    return output!;
  }
);
