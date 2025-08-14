import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateChatResponse } from '../flows/generate-chat-response';
import { buildCreatorProfileContext } from '../creatorProfileContext';
import { auth } from '@/lib/auth';

// Mock dependencies
vi.mock('../creatorProfileContext');
vi.mock('@/lib/auth');

const mockBuildCreatorProfileContext = buildCreatorProfileContext as any;
const mockAuth = auth as any;

describe('generateChatResponse Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should use provided creatorProfile without fetching', async () => {
    const input = {
      query: 'Give me content ideas',
      creatorProfile: 'Provided creator profile',
    };

    // Mock authentication
    mockAuth.mockResolvedValue({
      user: { id: 'test-user-id' },
    });

    // This should NOT be called since creatorProfile is already provided
    mockBuildCreatorProfileContext.mockResolvedValue('Fetched creator profile');

    const result = await generateChatResponse(input);

    // Verify that the fetch function was not called
    expect(mockBuildCreatorProfileContext).not.toHaveBeenCalled();

    // Verify that the result contains a response
    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('followUpPrompts');
    expect(Array.isArray(result.followUpPrompts)).toBe(true);
    expect(result.followUpPrompts).toHaveLength(2);
  });

  it('should fetch and inject creatorProfile when not provided', async () => {
    const input = {
      query: 'Give me content ideas',
    };

    mockAuth.mockResolvedValue({
      user: { id: 'test-user-id' },
    });

    mockBuildCreatorProfileContext.mockResolvedValue('Fetched creator profile');

    const result = await generateChatResponse(input);

    // Verify that creatorProfile was fetched
    expect(mockBuildCreatorProfileContext).toHaveBeenCalledWith();

    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('followUpPrompts');
  });

  it('should handle creator profile unavailable gracefully', async () => {
    const input = {
      query: 'Give me content ideas',
    };

    mockAuth.mockResolvedValue({
      user: { id: 'test-user-id' },
    });

    mockBuildCreatorProfileContext.mockResolvedValue('Creator profile unavailable.');

    const result = await generateChatResponse(input);

    // Verify that creatorProfile was attempted to be fetched
    expect(mockBuildCreatorProfileContext).toHaveBeenCalledWith();

    // Should still return a valid response
    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('followUpPrompts');
  });

  it('should handle authentication failure gracefully', async () => {
    const input = {
      query: 'Help me with content',
    };

    mockAuth.mockResolvedValue(null); // No authenticated user

    mockBuildCreatorProfileContext.mockResolvedValue('Fetched creator profile');

    const result = await generateChatResponse(input);

    // Verify that no profile was fetched due to lack of authentication
    expect(mockBuildCreatorProfileContext).not.toHaveBeenCalled();

    // Should still return a valid response
    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('followUpPrompts');
  });

  it('should handle profile fetching errors gracefully', async () => {
    const input = {
      query: 'Help me with content',
    };

    mockAuth.mockResolvedValue({
      user: { id: 'test-user-id' },
    });

    mockBuildCreatorProfileContext.mockRejectedValue(new Error('Database error'));

    const result = await generateChatResponse(input);

    // Verify that creatorProfile was attempted to be fetched
    expect(mockBuildCreatorProfileContext).toHaveBeenCalledWith();

    // Should still return a valid response despite errors
    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('followUpPrompts');
  });

  it('should include conversation history in the prompt', async () => {
    const input = {
      query: 'What was my last question?',
      history: [
        { role: 'user' as const, content: 'How do I grow my YouTube channel?' },
        { role: 'model' as const, content: 'Here are some strategies...' },
      ],
    };

    mockAuth.mockResolvedValue({
      user: { id: 'test-user-id' },
    });

    mockBuildCreatorProfileContext.mockResolvedValue('Fetched creator profile');

    const result = await generateChatResponse(input);

    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('followUpPrompts');
  });

  it('should include document content in the prompt', async () => {
    const input = {
      query: 'Analyze this document',
      documentContent: 'This is a sample document content for analysis.',
    };

    mockAuth.mockResolvedValue({
      user: { id: 'test-user-id' },
    });

    mockBuildCreatorProfileContext.mockResolvedValue('Fetched creator profile');

    const result = await generateChatResponse(input);

    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('followUpPrompts');
  });

  it('should generate relevant follow-up prompts for creators', async () => {
    const input = {
      query: 'Give me content ideas for my tech channel',
    };

    mockAuth.mockResolvedValue({
      user: { id: 'test-user-id' },
    });

    mockBuildCreatorProfileContext.mockResolvedValue('Fetched creator profile');

    const result = await generateChatResponse(input);

    expect(result.followUpPrompts).toHaveLength(2);
    expect(typeof result.followUpPrompts[0]).toBe('string');
    expect(typeof result.followUpPrompts[1]).toBe('string');
    expect(result.followUpPrompts[0]).not.toBe(result.followUpPrompts[1]);
  });

  it('should work without any profile context', async () => {
    const input = {
      query: 'What is the weather like?',
    };

    mockAuth.mockResolvedValue(null); // No authenticated user

    const result = await generateChatResponse(input);

    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('followUpPrompts');
    expect(result.followUpPrompts).toHaveLength(2);
  });
});
