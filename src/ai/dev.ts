'use server';

import { config } from 'dotenv';
config();

import '@/ai/flows/generate-captions.ts';
import '@/ai/flows/generate-hashtags.ts';
import '@/ai/flows/generate-script.ts';
import '@/ai/flows/generate-ideas.ts';
import '@/ai/flows/generate-chat-response.ts';
