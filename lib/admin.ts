import { revalidatePath, revalidateTag } from 'next/cache';
import { SITE_CACHE_TAG } from './db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';

/**
 * İsteği yapan kullanıcının admin olup olmadığını kontrol eder.
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return !!session && session.user.role === 'admin';
}

/**
 * Admin panelinde yapılan bir değişiklikten sonra tüm sitenin önbelleğini temizler.
 * Sayfalar statik (hızlı) kalır, ancak bir sonraki ziyarette güncel veriyle yeniden üretilir.
 */
export function revalidateSite() {
  revalidateTag(SITE_CACHE_TAG); // Veritabanı sorgu önbelleği
  revalidatePath('/', 'layout'); // Sayfa önbelleği
}
