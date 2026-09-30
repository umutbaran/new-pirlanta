import { NextResponse } from 'next/server';
import { getProducts, addProduct } from '@/lib/db';
import { isAdmin, revalidateSite } from '@/lib/admin';
import { productSchema } from '@/lib/schemas';
import { Prisma } from '@prisma/client';

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  // 1. Yetkilendirme Kontrolü
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Yetkisiz erişim - Sadece adminler ürün ekleyebilir' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // 2. Merkezi Şema ile Doğrulama
    const validation = productSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Geçersiz veri', 
        details: validation.error.format() 
      }, { status: 400 });
    }

    const newProduct = await addProduct(validation.data);
    revalidateSite();
    return NextResponse.json(newProduct);
  } catch (err: unknown) {
    console.error('Add Product Error:', err);

    // Prisma P2002 hatası: Unique constraint failed
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return NextResponse.json({ 
        error: 'Bu stok kodu (SKU) zaten başka bir üründe kullanılıyor. Lütfen farklı bir kod girin.' 
      }, { status: 400 });
    }

    return NextResponse.json({ error: 'Ürün eklenirken bir hata oluştu' }, { status: 500 });
  }
}
