
'use server';

import { joinFormSchema, type JoinFormInput } from '@/lib/schemas';

export async function handleJoinRequest(input: JoinFormInput) {
  const validation = joinFormSchema.safeParse(input);
  if (!validation.success) {
    const errorMessages = validation.error.errors.map((e) => e.message).join(', ');
    return { error: errorMessages };
  }

  try {
    // In a real application, you would save this to a database,
    // send an email, or trigger another workflow.
    console.log('New community application received:');
    console.log(validation.data);
    
    // Simulate a successful submission
    return { data: { success: true, message: 'Application submitted successfully!' } };

  } catch (error) {
    console.error('Failed to process join request:', error);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
}
