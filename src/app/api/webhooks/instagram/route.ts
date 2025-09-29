import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { PlatformDatabase } from '@/lib/platform-database';
export const runtime = 'nodejs';

// Instagram webhook verification and data handling
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  console.log('Instagram webhook verification request:', { mode, token, challenge });

  // Verify webhook
  if (mode === 'subscribe' && token === process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN) {
    console.log('Instagram webhook verified successfully');
    return new NextResponse(challenge, { status: 200 });
  }

  console.error('Instagram webhook verification failed:', { mode, token, expectedToken: process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN });
  return new NextResponse('Forbidden', { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-hub-signature-256');

    // Verify webhook signature if available
    if (signature && process.env.INSTAGRAM_WEBHOOK_SECRET) {
      const expectedSignature = 'sha256=' + crypto
        .createHmac('sha256', process.env.INSTAGRAM_WEBHOOK_SECRET)
        .update(body)
        .digest('hex');

      if (signature !== expectedSignature) {
        console.error('Instagram webhook signature verification failed');
        return new NextResponse('Unauthorized', { status: 401 });
      }
    }

    const data = JSON.parse(body);
    console.log('Instagram webhook received:', JSON.stringify(data, null, 2));

    // Store webhook event in database
    const webhookEvent = await PlatformDatabase.createWebhookEvent(
      'instagram',
      'webhook_received',
      data
    );

    // Handle different types of webhook events
    const { object, entry } = data;

    if (object === 'instagram') {
      for (const event of entry) {
        const { id, time, messaging } = event;

        if (messaging && messaging.length > 0) {
          for (const message of messaging) {
            const { sender, recipient, message: msg } = message;

            // Handle different message types
            if (msg) {
              console.log('Instagram message received:', {
                sender: sender.id,
                recipient: recipient.id,
                message: msg.text,
                timestamp: time,
              });

              // Process the message data
              await processInstagramWebhookData({
                senderId: sender.id,
                recipientId: recipient.id,
                message: msg,
                timestamp: time,
              });
            }
          }
        }

        // Handle other Instagram events
        if (event.changes) {
          for (const change of event.changes) {
            console.log('Instagram change event:', change);
            await processInstagramChangeEvent(change);
          }
        }
      }
    }

    // Mark webhook event as processed
    await PlatformDatabase.markWebhookEventProcessed(webhookEvent.id);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Instagram webhook error:', error);
    
    // Mark webhook event as processed with error
    try {
      const webhookEvent = await PlatformDatabase.createWebhookEvent(
        'instagram',
        'webhook_error',
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
      await PlatformDatabase.markWebhookEventProcessed(webhookEvent.id, error instanceof Error ? error.message : 'Unknown error');
    } catch (dbError) {
      console.error('Failed to log webhook error to database:', dbError);
    }

    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function processInstagramWebhookData(data: {
  senderId: string;
  recipientId: string;
  message: any;
  timestamp: number;
}) {
  try {
    console.log('Processing Instagram webhook data:', data);

    // Store in database for processing
    await PlatformDatabase.createWebhookEvent(
      'instagram',
      'message_received',
      data
    );

    // Additional processing logic can be added here:
    // - Extract hashtags from messages
    // - Update user engagement metrics
    // - Trigger notifications
    // - Sync with your platform

  } catch (error) {
    console.error('Error processing Instagram webhook data:', error);
  }
}

async function processInstagramChangeEvent(change: any) {
  try {
    console.log('Processing Instagram change event:', change);

    // Store change event in database
    await PlatformDatabase.createWebhookEvent(
      'instagram',
      'change_event',
      change
    );

    // Handle different types of changes:
    // - New posts/reels
    // - Comments
    // - Likes
    // - Followers
    // - Profile updates

    switch (change.field) {
      case 'mentions':
        console.log('New mention detected:', change.value);
        break;
      case 'comments':
        console.log('New comment detected:', change.value);
        break;
      case 'messages':
        console.log('New message detected:', change.value);
        break;
      default:
        console.log('Unhandled Instagram change field:', change.field);
    }

  } catch (error) {
    console.error('Error processing Instagram change event:', error);
  }
}
