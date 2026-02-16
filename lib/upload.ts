import { supabase } from './supabase';

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export async function uploadProductImage(file: File) {
  // 0. İstemci Kontrolü
  if (!supabase) {
    console.error('Supabase istemcisi başlatılamadı. .env dosyasını kontrol edin.');
    return null;
  }

  // 1. Güvenlik Kontrolleri
  if (!ALLOWED_TYPES.includes(file.type)) {
    console.error('Geçersiz dosya tipi:', file.type);
    return null;
  }

  if (file.size > MAX_FILE_SIZE) {
    console.error('Dosya boyutu çok büyük. Maksimum 5MB yükleyebilirsiniz.');
    return null;
  }

  try {
    // Dosya adını benzersiz yap (çakışmaması için)
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    // Supabase Storage'a yükle
    const { error } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase Upload Error Details:', error);
      throw error;
    }

    // Yüklenen resmin halka açık URL'sini al
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Yükleme hatası:', error);
    return null;
  }
}
