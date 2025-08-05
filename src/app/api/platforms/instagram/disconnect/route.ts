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
    
    // Remove Instagram data from storage
    platformDataStore.delete(`${userId}_instagram`);

    return NextResponse.json({ 
      success: true, 
      message: 'Instagram disconnected successfully' 
    });

  } catch (error) {
    console.error('Instagram disconnect error:', error);
    return NextResponse.json({ error: 'Failed to disconnect Instagram' }, { status: 500 });
  }
} 