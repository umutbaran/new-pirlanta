import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Auth bypass check for extreme debugging (Sadece geliştirme aşamasında log görmek için)
    if (!session) {
      console.warn("UPLOAD ATTEMPT WITHOUT SESSION");
      return NextResponse.json({ error: 'Yetkisiz erişim - Lütfen admin girişi yapın' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;

    // Vercel Log
    // console.log({
    //   hasUrl: !!supabaseUrl,
    //   hasKey: !!supabaseServiceKey,
    //   keyStart: supabaseServiceKey ? supabaseServiceKey.substring(0, 5) : 'NONE'
    // });

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ 
        error: `Yapılandırma hatası: ${!supabaseUrl ? 'URL' : 'Service Role Key'} eksik.` 
      }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const fileExt = file.name.split('.').pop();
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Geçersiz dosya türü. Sadece jpeg, png, webp kabul edilir.' }, { status: 400 });
    }
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    const buffer = await file.arrayBuffer();

    const { error: uploadError } = await supabaseAdmin.storage
      .from('products')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase Error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('products')
      .getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrl });
  } catch (err: any) {
    console.error('CRITICAL UPLOAD ERROR:', err);
    return NextResponse.json({ error: 'Sunucu hatası: ' + err.message }, { status: 500 });
  }
}
