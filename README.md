# new-pirlanta E-Ticaret Projesi

## Kurulum
1. `.env.example` dosyasındaki tüm değişkenleri doldurup `.env.local` olarak kopyalayın.
2. `npm install` ile bağımlılıkları yükleyin.
3. Gerekli veritabanı ve Supabase ayarlarını yapın.

## Geliştirme
- `npm run dev` ile geliştirme sunucusunu başlatın.
- Admin paneline giriş için `ADMIN_USERNAME` ve `ADMIN_PASSWORD` environment değişkenlerini kullanın.

## Özellikler
- Ürün yönetimi, kategori filtreleme, arama
- Güvenli admin paneli (authentication zorunlu)
- Dosya yükleme ve Supabase entegrasyonu
- Altın fiyatları canlı güncelleme
- TypeScript ile type safety

## Eksikler ve İyileştirmeler
- Sepet, sipariş, email bildirimleri, stok yönetimi, analytics henüz eklenmedi
- Tüm API endpointlerinde input validation ve hata kontrolü
- Güvenlik için environment değişkenleri zorunlu

## Deployment
- Production için build hatalarını gizlemeyin, tüm hataları düzeltin
- Sadece güvenli image domainleri whitelist edin

## Test
- Test dosyaları ve örnek veri eklenmeli

---

Daha fazla bilgi için kodu ve API dosyalarını inceleyin.
