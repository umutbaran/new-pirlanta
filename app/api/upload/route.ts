import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';
import { supabaseAdmin } from '@/lib/supabase';

// Vercel'in istek gövdesi sınırı 4.5MB olduğundan limit 4MB tutulur
const MAX_FILE_SIZE = 4 * 1024 * 1024;

// İzin verilen türler ve dosya uzantıları (uzantı dosya adından değil, türden belirlenir)
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Yetkisiz erişim - Lütfen admin girişi yapın' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Yapılandırma hatası: Supabase URL veya Service Role Key eksik.' }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }

    const fileExt = ALLOWED_TYPES[file.type];
    if (!fileExt) {
      return NextResponse.json({ error: 'Geçersiz dosya türü. Sadece JPEG, PNG ve WEBP kabul edilir.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Dosya boyutu çok büyük. Maksimum 4MB yüklenebilir.' }, { status: 400 });
    }

    const filePath = `product-images/${crypto.randomUUID()}.${fileExt}`;
    const buffer = await file.arrayBuffer();

    const { error: uploadError } = await supabaseAdmin.storage
      .from('products')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '31536000', // Dosya adları benzersiz olduğu için uzun süre önbelleklenebilir
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase Error:', uploadError);
      return NextResponse.json({ error: 'Görsel depolamaya yüklenemedi: ' + uploadError.message }, { status: 500 });
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('products')
      .getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrl });
  } catch (err: unknown) {
    console.error('CRITICAL UPLOAD ERROR:', err);
    return NextResponse.json({ error: 'Sunucu hatası: görsel yüklenemedi.' }, { status: 500 });
  }
}
