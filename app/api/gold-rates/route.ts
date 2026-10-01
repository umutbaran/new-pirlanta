import { NextResponse } from 'next/server';
import { getRates } from '@/lib/gold-rates';

export async function GET() {
  try {
    const result = await getRates();
    return NextResponse.json({ success: true, ...result });
  } catch (err: unknown) {
    console.error('Gold API Error:', err);
    // Eski/uydurma fiyat göstermek yerine boş veri döner; arayüz piyasa barını gizler
    return NextResponse.json({ success: false, rates: [] }, { status: 503 });
  }
}
