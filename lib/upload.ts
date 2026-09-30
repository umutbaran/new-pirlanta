import { getApiError } from './utils';

const MAX_FILE_SIZE = 4 * 1024 * 1024; // Sunucudaki limitle aynı (Vercel sınırı 4.5MB)

export async function uploadProductImage(file: File): Promise<string> {
  // Büyük dosyaları sunucuya göndermeden reddet (Vercel 413 hatasını JSON olmayan bir sayfayla döndürür)
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Dosya boyutu çok büyük (${(file.size / 1024 / 1024).toFixed(1)}MB). Maksimum 4MB yüklenebilir.`);
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 413) throw new Error('Dosya boyutu çok büyük (Maksimum 4MB).');
    throw new Error(await getApiError(response, 'Görsel yüklenemedi.'));
  }

  const data = await response.json() as { url: string };
  return data.url;
}
