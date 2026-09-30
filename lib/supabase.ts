import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY || '';

// Genel kullanım için anonim client
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

// Admin işlemleri (silme vb.) için service role client
export const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }) 
  : null;

/**
 * Supabase Storage'dan dosya siler
 * @param urls Silinecek dosyaların tam URL listesi
 */
export async function deleteStorageFiles(urls: string[]) {
  if (!supabaseAdmin || !urls.length) return;

  try {
    // URL'lerden dosya yollarını ayıkla (path)
    // Örnek: .../storage/v1/object/public/products/product-images/resim.jpg -> product-images/resim.jpg
    // Sadece kendi Supabase bucket'ımıza ait URL'leri işle (harici URL'lere dokunma)
    const bucketPrefix = `${supabaseUrl}/storage/v1/object/public/products/`;
    const paths = urls
      .filter(url => url.startsWith(bucketPrefix))
      .map(url => decodeURIComponent(url.slice(bucketPrefix.length)));

    if (paths.length > 0) {
      const { error } = await supabaseAdmin.storage
        .from('products')
        .remove(paths);
      
      if (error) console.error('Supabase Storage silme hatası:', error);
    }
  } catch (err) {
    console.error('Storage temizleme işlemi başarısız:', err);
  }
}
