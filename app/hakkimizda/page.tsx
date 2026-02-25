import Image from 'next/image';

export default function HakkimizdaPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif mb-6 tracking-tight text-slate-900">Hikayemiz</h1>
          <div className="w-20 h-1 bg-[#D4AF37] mx-auto mb-8"></div>
          <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed italic text-lg">
            &quot;Kapalıçarşı&apos;nın asırlık tozundan, modern pırlantanın ışıltısına uzanan bir zanaat yolculuğu.&quot;
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
            <Image 
              src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80" 
              alt="Mücevher Zanaatı" 
              fill 
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-serif text-slate-900">Zanaatın Kalbi</h2>
            <p className="text-slate-600 leading-relaxed">
              Baran Kuyumculuk olarak, nesiller boyu aktarılan kuyumculuk geleneğini New Pırlanta markasıyla modern çağa taşıyoruz. Her bir mücevherimiz, İstanbul&apos;un kalbi Kapalıçarşı&apos;daki atölyelerimizde usta eller tarafından titizlikle işlenmektedir.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Bizim için bir pırlanta sadece bir taş değil, bir anın, bir sözün ve sonsuz bir sevginin taşıyıcısıdır. Bu bilinçle, en kaliteli doğal taşları özenle seçiyor ve onları hayallerinizdeki tasarımlara dönüştürüyoruz.
            </p>
            <div className="pt-4 grid grid-cols-2 gap-8">
                <div>
                    <h4 className="text-2xl font-serif text-[#D4AF37]">40+</h4>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Yıllık Tecrübe</p>
                </div>
                <div>
                    <h4 className="text-2xl font-serif text-[#D4AF37]">10k+</h4>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Mutlu Müşteri</p>
                </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-12 md:p-20 rounded-[3rem] text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            <h3 className="text-3xl md:text-4xl font-serif mb-8 relative z-10 italic">&quot;Gerçek lüks, kusursuz detaylarda saklıdır.&quot;</h3>
            <p className="text-slate-400 max-w-xl mx-auto leading-relaxed relative z-10">
                New Pırlanta koleksiyonları, sertifikalı doğal taşlar ve yüksek ayar altın kullanılarak, uluslararası standartlarda üretilmektedir. Her bir ürünümüz, markamızın ömür boyu bakım garantisi altındadır.
            </p>
        </div>
      </div>
    </div>
  );
}
