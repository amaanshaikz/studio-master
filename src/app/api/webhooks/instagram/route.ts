import { NextRequest, NextResponse } from 'next/server';

// Instagram webhook verification and data handling
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Verify webhook
  if (mode === 'subscribe' && token === process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN) {
    console.log('Instagram webhook verified');
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Instagram webhook received:', body);

    // Handle different types of webhook events
    const { object, entry } = body;

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
              // This could include:
              // - New posts/reels
              // - Comments
              // - Likes
              // - Followers
              // - Media updates

              // Store or process the data as needed
              await processInstagramWebhookData({
                senderId: sender.id,
                recipientId: recipient.id,
                message: msg,
                timestamp: time,
              });
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Instagram webhook error:', error);
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
    // Process the webhook data
    // This could include:
    // - Storing new posts/reels in your database
    // - Updating user statistics
    // - Triggering notifications
    // - Syncing data with your platform

    console.log('Processing Instagram webhook data:', data);

    // Example: Store in database
    // await db.instagramWebhooks.create({
    //   senderId: data.senderId,
    //   recipientId: data.recipientId,
    //   message: data.message,
    //   timestamp: new Date(data.timestamp * 1000),
    // });

  } catch (error) {
    console.error('Error processing Instagram webhook data:', error);
  }
} 