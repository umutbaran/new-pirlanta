import { NextResponse } from 'next/server';
import { getProducts, addProduct } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { productSchema } from '@/lib/schemas';

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  // 1. Yetkilendirme Kontrolü
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
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
    return NextResponse.json(newProduct);
  } catch (err) {
    console.error('Add Product Error:', err);
    return NextResponse.json({ error: 'Ürün eklenirken bir hata oluştu' }, { status: 500 });
  }
}
