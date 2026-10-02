import { getApiError } from './utils';

const MAX_FILE_SIZE = 4 * 1024 * 1024; // Sunucudaki limitle aynı (Vercel sınırı 4.5MB)
const MAX_DIMENSION = 2000; // Sitede en büyük gösterim için yeterli; telefon fotoğrafları genelde 4000px ve üzeridir
const COMPRESS_THRESHOLD = 1.5 * 1024 * 1024;
const SERVER_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Görsel okunamadı')); };
    img.src = url;
  });
}

/**
 * Büyük fotoğrafları (özellikle telefon kamerasından gelenleri) yüklemeden önce tarayıcıda küçültür.
 * Böylece 4MB sınırına takılmaz ve mobil internette hızlı yüklenir. PNG'ler şeffaflığı korumak için
 * yalnızca sınırı aştığında dönüştürülür.
 */
async function prepareImage(file: File): Promise<File> {
  const supported = SERVER_TYPES.includes(file.type);
  const threshold = file.type === 'image/png' ? MAX_FILE_SIZE : COMPRESS_THRESHOLD;
  if (supported && file.size <= threshold) return file;

  try {
    const img = await loadImage(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.fillStyle = '#ffffff'; // JPEG şeffaflık taşımaz
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.88));
    if (!blob || (supported && blob.size >= file.size)) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' });
  } catch {
    // Tarayıcı görseli çözemezse dosya olduğu gibi gönderilir; tür/boyut hatasını aşağıdaki kontroller bildirir
    return file;
  }
}

export async function uploadProductImage(original: File): Promise<string> {
  const file = await prepareImage(original);

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
