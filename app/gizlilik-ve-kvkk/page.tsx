import { Metadata } from 'next';
import { getSettings } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Gizlilik ve KVKK Aydınlatma Metni',
  description: 'Kişisel verilerin korunması ve gizlilik politikamız.',
};

// NOT: Bu metin genel bir şablondur. Yayına almadan önce işletme bilgileriyle
// birlikte bir hukuk danışmanı tarafından gözden geçirilmesi önerilir.
export default async function PrivacyPage() {
  const settings = await getSettings();

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-[#D4AF37] tracking-[0.3em] text-xs font-bold uppercase mb-4 block">Yasal Bilgilendirme</span>
          <h1 className="text-3xl md:text-5xl font-serif text-gray-900">Gizlilik ve KVKK Aydınlatma Metni</h1>
        </div>

        <div className="space-y-8 text-gray-600 text-sm md:text-base leading-relaxed font-light [&_h2]:font-serif [&_h2]:text-xl [&_h2]:text-gray-900 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1">
          <section>
            <h2>1. Veri Sorumlusu</h2>
            <p>
              6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) kapsamında veri sorumlusu, {settings.siteTitle} markasıyla faaliyet gösteren Baran Kuyumculuk&apos;tur.
              {settings.address && <> Adres: <span className="whitespace-pre-line">{settings.address}</span>.</>}
              {settings.contactEmail && <> E-posta: <a href={`mailto:${settings.contactEmail}`} className="underline">{settings.contactEmail}</a>.</>}
            </p>
          </section>

          <section>
            <h2>2. İşlenen Kişisel Veriler ve Amaçları</h2>
            <p>Bu web sitesi üzerinden online satış yapılmamakta, üyelik alınmamaktadır. Kişisel verileriniz yalnızca bizimle iletişime geçtiğinizde işlenir:</p>
            <ul>
              <li><strong>İletişim formu ve WhatsApp:</strong> Adınız, (paylaşırsanız) telefon numaranız ve mesaj içeriğiniz; sorularınızı yanıtlamak, fiyat teklifi ve randevu taleplerinizi karşılamak amacıyla.</li>
              <li><strong>Telefon ve e-posta:</strong> Bize ulaştığınızda paylaştığınız iletişim bilgileri; talebinizi yanıtlamak amacıyla.</li>
            </ul>
          </section>

          <section>
            <h2>3. Hukuki Sebep ve Toplama Yöntemi</h2>
            <p>
              Verileriniz, bizimle iletişime geçmeniz sırasında elektronik ortamda toplanır ve KVKK madde 5/2-c (bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması) ile
              madde 5/2-f (veri sorumlusunun meşru menfaati) hukuki sebeplerine dayanılarak işlenir.
            </p>
          </section>

          <section>
            <h2>4. Verilerin Aktarılması</h2>
            <p>
              İletişim formu mesajınızı web sitemize kaydetmez; mesajınız cihazınızda WhatsApp uygulamasında açılır ve siz gönderdiğinizde WhatsApp (Meta Platforms) altyapısı üzerinden bize iletilir.
              Bu nedenle mesajınız WhatsApp&apos;ın gizlilik koşullarına tabi olarak yurt dışındaki sunucularda işlenebilir. Verileriniz bunun dışında üçüncü kişilerle paylaşılmaz; yalnızca yasal zorunluluk halinde yetkili kurumlara aktarılabilir.
            </p>
          </section>

          <section>
            <h2>5. Çerezler ve Tarayıcı Depolaması</h2>
            <ul>
              <li><strong>Favoriler:</strong> Favorilerinize eklediğiniz ürünler yalnızca kendi tarayıcınızda (localStorage) saklanır, bize iletilmez.</li>
              <li><strong>Üçüncü taraf içerikler:</strong> Piyasa Analiz sayfasında Investing.com tarafından sağlanan ekonomik takvim ve kur tabloları gösterilmektedir. Bu içerikler kendi çerezlerini kullanabilir.</li>
              <li>Sitemizde reklam veya kullanıcı takibi amaçlı çerez kullanılmamaktadır.</li>
            </ul>
          </section>

          <section>
            <h2>6. Haklarınız</h2>
            <p>KVKK madde 11 uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltilmesini veya silinmesini isteme, işlemeye itiraz etme ve zarara uğramanız halinde tazminat talep etme haklarına sahipsiniz.</p>
            <p className="mt-3">
              Başvurularınızı {settings.contactEmail ? <a href={`mailto:${settings.contactEmail}`} className="underline">{settings.contactEmail}</a> : 'iletişim'} adresine veya mağazalarımıza yazılı olarak iletebilirsiniz. Talepleriniz en geç 30 gün içinde ücretsiz olarak sonuçlandırılır.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
