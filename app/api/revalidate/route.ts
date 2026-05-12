import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * FIX: /api/revalidate supports both path and tag revalidation.
 * Protected by REVALIDATE_SECRET env var — configure in Vercel env.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const path = searchParams.get('path') || '/';
  const tag = searchParams.get('tag');

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: 'Invalid secret.' }, { status: 401 });
  }

  if (tag) {
    revalidateTag(tag);
    return NextResponse.json({ ok: true, revalidatedTag: tag });
  }

  revalidatePath(path);
  return NextResponse.json({ ok: true, revalidated: path });
}
