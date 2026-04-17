import { NextResponse } from 'next/server';
import { getAllCandidates } from '@/lib/blog-candidates';

export async function GET() {
  const candidates = getAllCandidates();
  return NextResponse.json({ candidates });
}
