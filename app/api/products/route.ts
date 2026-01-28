import { NextResponse } from 'next/server';
import { getProducts, addProduct } from '@/lib/db';

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newProduct = { ...body, id: Math.random().toString(36).substr(2, 9) };
  await addProduct(newProduct);
  return NextResponse.json(newProduct);
}
