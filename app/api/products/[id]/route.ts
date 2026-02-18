import { NextResponse } from 'next/server';
import { updateProduct, deleteProduct } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  // Authentication check
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await updateProduct(id, body);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Update failed', details: (err instanceof Error ? err.message : String(err)) }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Authentication check
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Delete failed', details: (err instanceof Error ? err.message : String(err)) }, { status: 500 });
  }
}
