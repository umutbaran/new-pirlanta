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
      console.error('Upload failed:', errorData.error);
      return null;
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Yükleme hatası:', error);
    return null;
  }
}
