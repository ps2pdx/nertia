import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/firebase';
import { ref, update } from 'firebase/database';

interface FeedbackPayload {
  generationId: string;
  rating: 1 | 5;
  feedbackText?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { generationId, rating, feedbackText }: FeedbackPayload = await request.json();

    if (!generationId || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (rating !== 1 && rating !== 5) {
      return NextResponse.json({ error: 'Rating must be 1 or 5' }, { status: 400 });
    }

    if (!database) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const generationRef = ref(database, `generations/${generationId}`);
    await update(generationRef, {
      rating,
      feedbackText: feedbackText || null,
      updatedAt: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json({ error: 'Failed to process feedback' }, { status: 500 });
  }
}
