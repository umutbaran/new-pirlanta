# New Pırlanta

Baran Kuyumculuk'un pırlanta ve altın ürünlerini tanıtan katalog sitesi. Online satış yoktur; ziyaretçiler ürünleri inceler ve WhatsApp, telefon veya mağaza üzerinden iletişime geçer.

**Teknolojiler:** Next.js 15 (App Router), Prisma + Supabase PostgreSQL, Supabase Storage (görseller), NextAuth (admin girişi), Tailwind CSS.

## Kurulum

1. `.env.example` dosyasını `.env` olarak kopyalayıp değerleri doldurun.
2. `npm install`
3. `npm run dev` → http://localhost:3000

Admin paneli: `/admin` (kullanıcı adı/şifre `.env` içindeki `ADMIN_USERNAME` / `ADMIN_PASSWORD`).

## Veritabanı

- Şema: `prisma/schema.prisma`. Şema değişikliğinden sonra `npx prisma db push` çalıştırın.
  Bunun için `DIRECT_URL` **6543 (transaction pooler) değil**, 5432 portlu bir bağlantı olmalıdır; aksi halde komut takılır.
- `npx prisma db seed` → `data/*.json` dosyalarındaki başlangıç verisini yükler (mevcut kayıtları günceller).

## Yapı

| Yol | Açıklama |
|---|---|
| `app/` | Sayfalar ve API rotaları (`app/api/*`) |
| `app/admin/` | Admin paneli (ürün, kategori, vitrin tasarımı, bülten, ayarlar) |
| `components/` | Ortak arayüz bileşenleri |
| `lib/db.ts` | Tüm veritabanı işlemleri |
| `lib/admin.ts` | Admin yetki kontrolü ve kayıt sonrası önbellek yenileme |
| `lib/images.ts` | İzin verilen görsel alan adları (next.config ve form doğrulaması ortak kullanır) |

## Notlar

- Admin panelinde yapılan her kayıt sitenin önbelleğini temizler; değişiklikler bir sonraki ziyarette görünür.
- Altın ve döviz kurları `finans.truncgil.com` kaynağından 5 dakikalık önbellekle alınır.
- İletişim formu mesajları sunucuya kaydedilmez, ziyaretçinin WhatsApp'ında hazır mesaj olarak açılır.
