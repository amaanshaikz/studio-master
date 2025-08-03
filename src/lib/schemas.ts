
import { z } from 'zod';

const historyItemSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

export const chatSchema = z.object({
  query: z.string().min(1, 'Please enter a message.'),
  history: z.array(historyItemSchema).optional(),
  documentContent: z.string().optional(),
});
export type ChatInput = z.infer<typeof chatSchema>;


export const generationSchema = z.object({
  topic: z.string().min(1, 'Please enter a topic.'),
  history: z.array(historyItemSchema).optional(),
  documentContent: z.string().optional(),
  
  // Universal options
  niche: z.string().optional(),
  audienceType: z.string().optional(),
  
  // Scripts
  hookStyle: z.string().optional(),
  targetPlatform: z.string().optional(),
  videoLength: z.string().optional(),
  callToAction: z.array(z.string()).optional(),

  // Captions
  captionLength: z.string().optional(),
  captionTone: z.string().optional(),
  platform: z.string().optional(),
  engagementTrigger: z.string().optional(),

  // Hashtags
  keywords: z.string().optional(),
  location: z.string().optional(),
  hashtagMix: z.string().optional(),
  blendStructure: z.boolean().optional(),
  hashtagGoals: z.array(z.string()).optional(),

  // Ideas
  contentGoal: z.string().optional(),
  contentTones: z.array(z.string()).optional(),
});


export type GenerationInput = z.infer<typeof generationSchema>;

export const joinFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  reason: z.string().min(10, { message: 'Please tell us a bit more (at least 10 characters).' }),
});

export type JoinFormInput = z.infer<typeof joinFormSchema>;
