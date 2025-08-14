import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PlatformDatabase } from '@/lib/platform-database';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    
    // Disconnect Instagram platform
    await PlatformDatabase.disconnectPlatform(userId, 'instagram');

    console.log('Instagram disconnected for user:', userId);

    return NextResponse.json({ 
      success: true, 
      message: 'Instagram disconnected successfully' 
    });

  } catch (error) {
    console.error('Instagram disconnect error:', error);
    return NextResponse.json({ error: 'Failed to disconnect Instagram' }, { status: 500 });
  }
} 