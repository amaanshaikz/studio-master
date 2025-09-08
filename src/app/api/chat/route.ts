import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/ai/flows/generate-chat-response';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const { query, transcript } = await req.json();
        if (!query || typeof query !== 'string') {
            return NextResponse.json({ error: 'Missing query' }, { status: 400 });
        }
        const result = await generateChatResponse({ query, history: [], documentContent: transcript || '' });
        return NextResponse.json({ answer: result.response });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
    }
}


