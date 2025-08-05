import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Mock data storage - replace with your database
const platformDataStore = new Map();

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    
    // Remove LinkedIn data from storage
    platformDataStore.delete(`${userId}_linkedin`);

    return NextResponse.json({ 
      success: true, 
      message: 'LinkedIn disconnected successfully' 
    });

  } catch (error) {
    console.error('LinkedIn disconnect error:', error);
    return NextResponse.json({ error: 'Failed to disconnect LinkedIn' }, { status: 500 });
  }
} 