import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { PlatformDatabase } from '@/lib/platform-database';

// LinkedIn webhook verification and data handling
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get('challenge');
  const token = searchParams.get('token');

  console.log('LinkedIn webhook verification request:', { challenge, token });

  // Verify webhook
  if (token === process.env.LINKEDIN_WEBHOOK_VERIFY_TOKEN) {
    console.log('LinkedIn webhook verified successfully');
    return new NextResponse(challenge, { status: 200 });
  }

  console.error('LinkedIn webhook verification failed:', { token, expectedToken: process.env.LINKEDIN_WEBHOOK_VERIFY_TOKEN });
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
    console.log('LinkedIn webhook received:', JSON.stringify(data, null, 2));

    // Store webhook event in database
    const webhookEvent = await PlatformDatabase.createWebhookEvent(
      'linkedin',
      'webhook_received',
      data
    );

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

    // Mark webhook event as processed
    await PlatformDatabase.markWebhookEventProcessed(webhookEvent.id);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('LinkedIn webhook error:', error);
    
    // Mark webhook event as processed with error
    try {
      const webhookEvent = await PlatformDatabase.createWebhookEvent(
        'linkedin',
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

function verifyLinkedInSignature(body: string, signature: string | null): boolean {
  if (!signature || !process.env.LINKEDIN_WEBHOOK_SECRET) {
    console.warn('LinkedIn webhook signature verification skipped - missing signature or secret');
    return true; // Allow if no signature verification is configured
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.LINKEDIN_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );

    if (!isValid) {
      console.error('LinkedIn webhook signature mismatch:', {
        received: signature,
        expected: expectedSignature
      });
    }

    return isValid;
  } catch (error) {
    console.error('LinkedIn webhook signature verification error:', error);
    return false;
  }
}

async function processLinkedInWebhookData(data: {
  changeType: string;
  object: any;
  timestamp: string;
}) {
  try {
    // Store change event in database
    await PlatformDatabase.createWebhookEvent(
      'linkedin',
      'change_event',
      data
    );

    // Process the webhook data based on change type
    switch (data.changeType) {
      case 'PROFILE_UPDATE':
        console.log('LinkedIn profile updated:', data.object);
        await handleLinkedInProfileUpdate(data.object);
        break;

      case 'CONNECTION_ADDED':
        console.log('LinkedIn connection added:', data.object);
        await handleLinkedInConnectionAdded(data.object);
        break;

      case 'POST_CREATED':
        console.log('LinkedIn post created:', data.object);
        await handleLinkedInPostCreated(data.object);
        break;

      case 'ENGAGEMENT':
        console.log('LinkedIn engagement:', data.object);
        await handleLinkedInEngagement(data.object);
        break;

      case 'COMPANY_UPDATE':
        console.log('LinkedIn company update:', data.object);
        await handleLinkedInCompanyUpdate(data.object);
        break;

      default:
        console.log('Unhandled LinkedIn change type:', data.changeType);
        await handleLinkedInUnknownEvent(data);
    }

  } catch (error) {
    console.error('Error processing LinkedIn webhook data:', error);
  }
}

async function handleLinkedInProfileUpdate(profileData: any) {
  try {
    console.log('Processing LinkedIn profile update:', profileData);
    
    // Store profile update event
    await PlatformDatabase.createWebhookEvent(
      'linkedin',
      'profile_update',
      profileData
    );

    // Additional processing:
    // - Update user profile in your database
    // - Sync with your platform
    // - Trigger notifications

  } catch (error) {
    console.error('Error handling LinkedIn profile update:', error);
  }
}

async function handleLinkedInConnectionAdded(connectionData: any) {
  try {
    console.log('Processing LinkedIn connection added:', connectionData);
    
    // Store connection event
    await PlatformDatabase.createWebhookEvent(
      'linkedin',
      'connection_added',
      connectionData
    );

    // Additional processing:
    // - Update connection count
    // - Store connection data
    // - Trigger notifications

  } catch (error) {
    console.error('Error handling LinkedIn connection added:', error);
  }
}

async function handleLinkedInPostCreated(postData: any) {
  try {
    console.log('Processing LinkedIn post created:', postData);
    
    // Store post event
    await PlatformDatabase.createWebhookEvent(
      'linkedin',
      'post_created',
      postData
    );

    // Additional processing:
    // - Store post data
    // - Update post count
    // - Extract content for analysis
    // - Trigger notifications

  } catch (error) {
    console.error('Error handling LinkedIn post created:', error);
  }
}

async function handleLinkedInEngagement(engagementData: any) {
  try {
    console.log('Processing LinkedIn engagement:', engagementData);
    
    // Store engagement event
    await PlatformDatabase.createWebhookEvent(
      'linkedin',
      'engagement',
      engagementData
    );

    // Additional processing:
    // - Update engagement metrics
    // - Store engagement data
    // - Trigger notifications

  } catch (error) {
    console.error('Error handling LinkedIn engagement:', error);
  }
}

async function handleLinkedInCompanyUpdate(companyData: any) {
  try {
    console.log('Processing LinkedIn company update:', companyData);
    
    // Store company update event
    await PlatformDatabase.createWebhookEvent(
      'linkedin',
      'company_update',
      companyData
    );

    // Additional processing:
    // - Update company information
    // - Sync with your platform
    // - Trigger notifications

  } catch (error) {
    console.error('Error handling LinkedIn company update:', error);
  }
}

async function handleLinkedInUnknownEvent(eventData: any) {
  try {
    console.log('Processing unknown LinkedIn event:', eventData);
    
    // Store unknown event for analysis
    await PlatformDatabase.createWebhookEvent(
      'linkedin',
      'unknown_event',
      eventData
    );

  } catch (error) {
    console.error('Error handling unknown LinkedIn event:', error);
  }
} 