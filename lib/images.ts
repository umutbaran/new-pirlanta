/**
 * next/image'in görsel optimizasyonu için izin verilen harici alan adları.
 * Hem next.config.ts hem de form doğrulaması bu listeyi kullanır; listede olmayan
 * bir alan adından görsel kaydedilirse sayfa çalışma anında hata verir.
 */
export const ALLOWED_IMAGE_HOSTS = [
  'images.unsplash.com',
  '**.supabase.co',
  'cdn.qukasoft.com',
];

function hostMatches(hostname: string, pattern: string): boolean {
  if (pattern.startsWith('**.')) {
    const suffix = pattern.slice(2); // ".supabase.co"
    return hostname.endsWith(suffix);
  }
  return hostname === pattern;
}

export function isAllowedImageUrl(url: string): boolean {
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === 'https:' && ALLOWED_IMAGE_HOSTS.some(p => hostMatches(hostname, p));
  } catch {
    return false;
  }
}

export const IMAGE_HOST_ERROR = `Görsel adresi desteklenmiyor. Görseli "Cihazdan Yükle" ile yükleyin veya şu adreslerden birini kullanın: ${ALLOWED_IMAGE_HOSTS.join(', ')}`;
