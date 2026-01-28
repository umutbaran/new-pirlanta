import { supabase } from './supabase';

export async function uploadProductImage(file: File) {
  try {
    // Dosya adını benzersiz yap (çakışmaması için)
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    // Supabase Storage'a yükle
    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (error) {
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
