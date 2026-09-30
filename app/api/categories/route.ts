import { NextResponse } from 'next/server';
import { getCategories, saveCategories, CategoryRuleError } from '@/lib/db';
import { isAdmin, revalidateSite } from '@/lib/admin';
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
  if (!(await isAdmin())) {
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
    revalidateSite();
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof CategoryRuleError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: 'Kategoriler kaydedilemedi' }, { status: 500 });
  }
}
