export async function uploadProductImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMsg = errorData.error || 'Bilinmeyen sunucu hatası';
      console.error('Upload failed:', errorMsg);
      
      if (response.status === 401) throw new Error('Oturumunuz kapalı. Lütfen tekrar admin girişi yapın.');
      if (response.status === 413) throw new Error('Dosya boyutu çok büyük (Maksimum 4MB).');
      
      throw new Error(errorMsg);
    }

    const data = await response.json();
    return data.url;
  } catch (error: any) {
    console.error('Yükleme hatası:', error);
    throw error;
  }
}
