import { revalidatePath, revalidateTag } from 'next/cache';
import { SITE_CACHE_TAG, getSettings } from './db';
import { withVisiblePrices } from './utils';
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

/**
 * Fiyatlar sitede gizliyken herkese açık API yanıtlarından fiyat alanlarını çıkarır
 * (aksi halde fiyatlar sayfada gizli olsa bile API'den okunabilir). Admin her zaman tam veriyi görür.
 */
export async function publicProductView<T extends { price: number; oldPrice?: number | null }>(products: T[]): Promise<T[]> {
  const { showPrices } = await getSettings();
  return withVisiblePrices(products, showPrices || (await isAdmin()));
}
