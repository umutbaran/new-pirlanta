export type Category = 'pirlanta' | 'altin-22' | 'altin-14' | 'sarrafiye' | 'yeni';
export type SubCategory = 'tektas' | 'baget' | 'alyans' | 'bilezik' | 'kolye' | 'kupe' | 'bileklik' | 'set' | 'yatirim';

export interface Product {
  id: string;
  sku: string; // Stok Kodu
  name: string;
  category: Category;
  subCategory: SubCategory;
  price: number;
  oldPrice?: number;
  isNew?: boolean;
  description: string;
  images: string[]; // Birden fazla resim
  createdAt?: Date | string; // Eklenen
  updatedAt?: Date | string; // Eklenen
  details: {
    materyal: string; // 14 Ayar Altın
    renk: string; // White Gold, Rose Gold
    agirlik: string; // 2.45 gr
    tas_bilgisi?: {
      tip: string; // Pırlanta
      karat: string; // 0.30 ct
      renk: string; // F Color
      berraklik: string; // VS1
      kesim: string; // Very Good
      sekil: string; // Yuvarlak (Round)
    };
    sertifika: string; // HRD Antwerp / Firma Sertifikalı
    garanti: string; // 2 Yıl Bakım Garantisi
  };
}

export const products: Product[] = [
  // --- PIRLANTA ---
  {
    id: 'p1',
    sku: 'NP-dia-001',
    name: '0.70 Karat Baget Pırlanta Yüzük',
    category: 'pirlanta',
    subCategory: 'baget',
    price: 32500,
    oldPrice: 45000,
    isNew: true,
    description: 'Modern çizgilerin ışıltıyla buluştuğu baget kesim pırlanta yüzük. Merkezdeki dikdörtgen kesim taşlar, kenarlardaki yuvarlak pırlantalarla desteklenerek göz alıcı bir parlaklık sunar.',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80',
      'https://images.unsplash.com/photo-1603561596112-0a132b72231d?q=80',
    ],
    details: {
      materyal: '14 Ayar Beyaz Altın',
      renk: 'Beyaz (White Gold)',
      agirlik: '2.10 gr (±%5)',
      tas_bilgisi: {
        tip: 'Doğal Pırlanta',
        karat: '0.70 ct Toplam',
        renk: 'G (Ekstra Beyaz)',
        berraklik: 'VS (Çok Küçük Lekeli)',
        kesim: 'Baget & Yuvarlak',
        sekil: 'Dikdörtgen'
      },
      sertifika: 'New Pırlanta Uluslararası Geçerli Sertifika',
      garanti: 'Ömür Boyu Bakım Garantisi'
    }
  },
  {
    id: 'p2',
    sku: 'NP-dia-002',
    name: '1.00 Karat Tektaş Pırlanta Yüzük',
    category: 'pirlanta',
    subCategory: 'tektas',
    price: 85000,
    oldPrice: 110000,
    description: 'Klasik 6 tırnaklı montür üzerinde yükselen, kusursuz kesime sahip tektaş pırlanta. Evlilik tekliflerinin vazgeçilmez simgesi.',
    images: [
      'https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?q=80',
    ],
    details: {
      materyal: '18 Ayar Beyaz Altın',
      renk: 'Beyaz (White Gold)',
      agirlik: '3.50 gr (±%5)',
      tas_bilgisi: {
        tip: 'Doğal Pırlanta',
        karat: '1.00 ct',
        renk: 'F (Nadir Beyaz)',
        berraklik: 'SI1',
        kesim: 'Excellent (Mükemmel)',
        sekil: 'Yuvarlak (Round Brilliant)'
      },
      sertifika: 'HRD Antwerp Sertifikalı',
      garanti: 'Ömür Boyu Bakım Garantisi'
    }
  },

  // --- ALTIN ---
  {
    id: 'a1',
    sku: 'NP-gold-001',
    name: '22 Ayar Ajda Bilezik',
    category: 'altin-22',
    subCategory: 'bilezik',
    price: 26500,
    description: 'Geleneksel yatırım aracı, modern kullanım. İçi dolu, ezilmeye dayanıklı 22 ayar Ajda model bilezik.',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80',
    ],
    details: {
      materyal: '22 Ayar Altın (916 Milyem)',
      renk: 'Sarı',
      agirlik: '10.00 gr',
      sertifika: 'TSE Onaylı & Firma Sertifikalı',
      garanti: 'Ayar Garantili'
    }
  },
  
  // --- SARRAFİYE ---
  {
    id: 's1',
    sku: 'NP-sar-001',
    name: 'Yeni Tarihli Çeyrek Altın',
    category: 'sarrafiye',
    subCategory: 'yatirim',
    price: 4950,
    description: 'T.C. Darphane basımı, kulplu, yeni tarihli çeyrek altın.',
    images: [
      'https://images.unsplash.com/photo-1610375460969-d941b7416972?auto=format&fit=crop&q=80',
    ],
    details: {
      materyal: '22 Ayar Altın',
      renk: 'Sarı',
      agirlik: '1.75 gr',
      sertifika: 'Darphane Çıkışlı',
      garanti: 'Süresiz Değişim'
    }
  },
  
  // --- YENİ EKLENENLER ---
  {
    id: 'p3',
    sku: 'NP-set-001',
    name: '3.50 Karat Baget Pırlanta Set',
    category: 'pirlanta',
    subCategory: 'set',
    price: 145000,
    oldPrice: 180000,
    isNew: true,
    description: 'Düğün ve özel davetlerin vazgeçilmezi. Gerdanlık, küpe ve bileklikten oluşan, toplam 3.50 karat baget ve yuvarlak pırlantalarla bezenmiş muazzam set.',
    images: [
      'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&q=80',
    ],
    details: {
      materyal: '14 Ayar Beyaz Altın',
      renk: 'Beyaz',
      agirlik: '22.50 gr',
      tas_bilgisi: {
        tip: 'Pırlanta',
        karat: '3.50 ct',
        renk: 'G-H',
        berraklik: 'VS-SI',
        kesim: 'Baget & Round',
        sekil: 'Özel Tasarım'
      },
      sertifika: 'Uluslararası Sertifikalı',
      garanti: '5 Yıl Bakım'
    }
  },
  {
    id: 'a2',
    sku: 'NP-gold-002',
    name: '22 Ayar Adana Burma Bilezik',
    category: 'altin-22',
    subCategory: 'bilezik',
    price: 42000,
    description: 'Yatırımın en güvenli limanı. 20 gram 22 ayar, işçiliksiz, bozdururken değer kaybetmeyen klasik Adana Burma.',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80'
    ],
    details: {
      materyal: '22 Ayar (916)',
      renk: 'Sarı',
      agirlik: '20.00 gr',
      sertifika: 'Firma Sertifikalı',
      garanti: 'Ayar Garantili'
    }
  },
  {
    id: 'al1',
    sku: 'NP-aly-001',
    name: 'Klasik İtalyan Bombeli Alyans',
    category: 'altin-14',
    subCategory: 'alyans',
    price: 8500,
    description: 'Zamanın ötesinde bir klasik. İçi dolu, konfor bombeli, parmağı rahatsız etmeyen 14 ayar sarı altın alyans.',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80'
    ],
    details: {
      materyal: '14 Ayar Altın',
      renk: 'Sarı',
      agirlik: '3.50 gr',
      sertifika: 'Firma Sertifikalı',
      garanti: 'Ömür Boyu Parlatma'
    }
  },
  {
    id: 'al2',
    sku: 'NP-aly-002',
    name: 'Modern Tasarım Pırlantalı Alyans',
    category: 'pirlanta',
    subCategory: 'alyans',
    price: 12750,
    description: 'Modern çiftler için özel tasarım. Kadın modelinde tam tur pırlanta efektli işlemeler, erkek modelinde mat detaylar.',
    images: [
      'https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?q=80'
    ],
    details: {
      materyal: '14 Ayar Beyaz Altın',
      renk: 'Beyaz',
      agirlik: '5.00 gr (Çift)',
      sertifika: 'Firma Sertifikalı',
      garanti: 'Ömür Boyu Bakım'
    }
  }
];
