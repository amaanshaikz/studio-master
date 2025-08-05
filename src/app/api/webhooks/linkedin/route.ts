import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// LinkedIn webhook verification and data handling
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get('challenge');
  const token = searchParams.get('token');

  // Verify webhook
  if (token === process.env.LINKEDIN_WEBHOOK_VERIFY_TOKEN) {
    console.log('LinkedIn webhook verified');
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-linkedin-signature');

    // Verify webhook signature
    if (!verifyLinkedInSignature(body, signature)) {
      console.error('LinkedIn webhook signature verification failed');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = JSON.parse(body);
    console.log('LinkedIn webhook received:', data);

    // Handle different types of webhook events
    const { changeEvent } = data;

    if (changeEvent) {
      const { changeType, object } = changeEvent;

      console.log('LinkedIn change event:', {
        changeType,
        object,
        timestamp: new Date().toISOString(),
      });

      // Process the webhook data based on change type
      await processLinkedInWebhookData({
        changeType,
        object,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('LinkedIn webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

function verifyLinkedInSignature(body: string, signature: string | null): boolean {
  if (!signature || !process.env.LINKEDIN_WEBHOOK_SECRET) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.LINKEDIN_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

async function processLinkedInWebhookData(data: {
  changeType: string;
  object: any;
  timestamp: string;
}) {
  try {
    // Process the webhook data based on change type
    switch (data.changeType) {
      case 'PROFILE_UPDATE':
        console.log('LinkedIn profile updated:', data.object);
        // Handle profile updates
        // - Update user profile information
        // - Sync with your database
        // - Trigger notifications
        break;

      case 'CONNECTION_ADDED':
        console.log('LinkedIn connection added:', data.object);
        // Handle new connections
        // - Update connection count
        // - Store connection data
        break;

      case 'POST_CREATED':
        console.log('LinkedIn post created:', data.object);
        // Handle new posts
        // - Store post data
        // - Update post count
        // - Extract content for analysis
        break;

      case 'ENGAGEMENT':
        console.log('LinkedIn engagement:', data.object);
        // Handle engagement (likes, comments, shares)
        // - Update engagement metrics
        // - Store engagement data
        break;

      default:
        console.log('Unhandled LinkedIn change type:', data.changeType);
    }

    // Store webhook data in database
    // await db.linkedinWebhooks.create({
    //   changeType: data.changeType,
    //   object: data.object,
    //   timestamp: new Date(data.timestamp),
    // });

  } catch (error) {
    console.error('Error processing LinkedIn webhook data:', error);
  }
} 