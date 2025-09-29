import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PlatformDatabase } from '@/lib/platform-database';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    
    // Disconnect LinkedIn platform
    await PlatformDatabase.disconnectPlatform(userId, 'linkedin');

    console.log('LinkedIn disconnected for user:', userId);

    return NextResponse.json({ 
      success: true, 
      message: 'LinkedIn disconnected successfully' 
    });

  } catch (error) {
    console.error('LinkedIn disconnect error:', error);
    return NextResponse.json({ error: 'Failed to disconnect LinkedIn' }, { status: 500 });
  }
}
