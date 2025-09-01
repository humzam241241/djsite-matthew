// app/api/content/home/route.ts
import { NextResponse } from 'next/server';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function POST(req: Request) {
  const body = await req.json();
  // { heroImageUrl?: string, heroVideoUrl?: string, ... }
  const filePath = join(process.cwd(), 'content', 'landing.json');
  
  try {
    await writeFile(filePath, JSON.stringify(body, null, 2), 'utf-8');
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Error saving content:', error);
    return NextResponse.json({ error: error.message || 'Failed to save content' }, { status: 500 });
  }
}
