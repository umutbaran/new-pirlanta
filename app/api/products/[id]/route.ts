import { NextResponse } from 'next/server';
import { updateProduct, deleteProduct, getProductById } from '@/lib/db';
import { isAdmin, revalidateSite, publicProductView } from '@/lib/admin';
import { productSchema } from '@/lib/schemas';
import { Prisma } from '@prisma/client';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const product = await getProductById(id);
    if (!product) return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
    const [visible] = await publicProductView([product]);
    return NextResponse.json(visible);
  } catch (err) {
    console.error('Get Product Error:', err);
    return NextResponse.json({ error: 'Ürün getirilemedi' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = productSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0]?.message || 'Geçersiz veri', details: validation.error.format() }, { status: 400 });
    }

    await updateProduct(id, validation.data);
    revalidateSite();
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('Update Product Error:', err);
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return NextResponse.json({
        error: 'Bu stok kodu (SKU) zaten başka bir üründe kullanılıyor. Lütfen farklı bir kod girin.'
      }, { status: 400 });
    }
    return NextResponse.json({ error: 'Güncelleme başarısız oldu' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    await deleteProduct(id);
    revalidateSite();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete Product Error:', err);
    return NextResponse.json({ error: 'Silme işlemi başarısız' }, { status: 500 });
  }
}
