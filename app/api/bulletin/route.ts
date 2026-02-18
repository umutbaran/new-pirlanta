import { NextResponse } from 'next/server';
import { getBulletins, saveBulletins } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { z } from 'zod';

const bulletinSchema = z.array(z.object({
  id: z.string(),
  date: z.string(),
  time: z.string(),
  country: z.string(),
  event: z.string(),
  importance: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  impact: z.enum(['up', 'down', 'neutral']),
  description: z.string().optional(),
}));

export async function GET() {
  const bulletins = await getBulletins();
  return NextResponse.json(bulletins);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = bulletinSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Geçersiz veri formatı', details: validation.error.format() }, { status: 400 });
    }

    await saveBulletins(validation.data);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Bülten kaydedilemedi' }, { status: 500 });
  }
}
