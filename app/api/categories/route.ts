import { NextResponse } from 'next/server';
import { getCategories, saveCategories } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from 'zod';

const categorySchema = z.array(z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: z.string().min(1),
  isActive: z.boolean(),
  isSpecial: z.boolean().optional(),
  subCategories: z.array(z.object({
    name: z.string(),
    slug: z.string()
  }))
}));

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  // 1. Yetki Kontrolü
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // 2. Veri Doğrulama
    const validation = categorySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Geçersiz veri formatı', details: validation.error.format() }, { status: 400 });
    }

    await saveCategories(validation.data);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Kategoriler kaydedilemedi' }, { status: 500 });
  }
}
