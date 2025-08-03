
'use server';

import { generateScript, type GenerateScriptInput, type GenerateScriptOutput } from '@/ai/flows/generate-script';
import { generateCaptions, type GenerateCaptionsInput, type GenerateCaptionsOutput } from '@/ai/flows/generate-captions';
import { generateHashtags, type GenerateHashtagsInput, type GenerateHashtagsOutput } from '@/ai/flows/generate-hashtags';
import { generateIdeas, type GenerateIdeasInput, type GenerateIdeasOutput } from '@/ai/flows/generate-ideas';
import { generateChatResponse, type GenerateChatResponseInput, type GenerateChatResponseOutput } from '@/ai/flows/generate-chat-response';
import { generationSchema, chatSchema } from '@/lib/schemas';


export async function handleGenerateScript(input: GenerateScriptInput) {
  const validation = generationSchema.safeParse(input);
  if (!validation.success) {
    const errorMessages = validation.error.errors.map(e => e.message).join(', ');
    return { error: errorMessages };
  }
  try {
    const result = await generateScript(validation.data);
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to generate script. Please try again.' };
  }
}

export async function handleGenerateCaptions(input: GenerateCaptionsInput) {
  const validation = generationSchema.safeParse(input);
  if (!validation.success) {
    const errorMessages = validation.error.errors.map(e => e.message).join(', ');
    return { error: errorMessages };
  }
  try {
    const result = await generateCaptions(validation.data);
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to generate captions. Please try again.' };
  }
}

export async function handleGenerateHashtags(input: GenerateHashtagsInput) {
  const validation = generationSchema.safeParse(input);
   if (!validation.success) {
    const errorMessages = validation.error.errors.map(e => e.message).join(', ');
    return { error: errorMessages };
  }
  try {
    const result = await generateHashtags(validation.data);
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to generate hashtags. Please try again.' };
  }
}

export async function handleGenerateIdeas(input: GenerateIdeasInput) {
    const validation = generationSchema.safeParse(input);
    if (!validation.success) {
      const errorMessages = validation.error.errors.map(e => e.message).join(', ');
      return { error: errorMessages };
    }
    try {
      const result = await generateIdeas(validation.data);
      return { data: result };
    } catch (error) {
      console.error(error);
      return { error: 'Failed to generate ideas. Please try again.' };
    }
}

export async function handleGenerateChatResponse(input: GenerateChatResponseInput) {
  const validation = chatSchema.safeParse(input);
  if (!validation.success) {
    const errorMessages = validation.error.errors.map(e => e.message).join(', ');
    return { error: errorMessages };
  }
  try {
    const result = await generateChatResponse(validation.data);
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to generate chat response. Please try again.' };
  }
}
