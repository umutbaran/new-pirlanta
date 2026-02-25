import { NextResponse } from 'next/server';
import { updateProduct, deleteProduct } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(2, "Ürün adı en az 2 karakter olmalı"),
  category: z.string(),
  price: z.number().min(0, "Fiyat 0'dan küçük olamaz"),
  sku: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
}).passthrough();

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Authentication check
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Validation
    const validation = productSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Geçersiz veri', details: validation.error.format() }, { status: 400 });
    }

    await updateProduct(id, validation.data);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Update Error:', err);
    return NextResponse.json({ error: 'Güncelleme başarısız oldu' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Authentication check
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Delete failed', details: (err instanceof Error ? err.message : String(err)) }, { status: 500 });
  }
}
