import { NextResponse } from 'next/server';
import { getProducts, addProduct } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(2, "Ürün adı en az 2 karakter olmalı"),
  category: z.string(),
  price: z.number().min(0, "Fiyat 0'dan küçük olamaz"),
  sku: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  // Diğer alanlar opsiyonel veya any olarak geçebilir şimdilik
}).passthrough(); // Bilinmeyen ekstra alanlara izin ver (esneklik için)

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  // 1. Yetkilendirme Kontrolü
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // 2. Girdi Doğrulama (Validation)
    const validation = productSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Geçersiz veri', details: validation.error.format() }, { status: 400 });
    }

    const newProduct = await addProduct(validation.data as any);
    return NextResponse.json(newProduct);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Ürün eklenirken bir hata oluştu' }, { status: 500 });
  }
}
