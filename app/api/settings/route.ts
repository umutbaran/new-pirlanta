import { NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/db';

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  const body = await request.json();
  await saveSettings(body);
  return NextResponse.json({ success: true });
}
