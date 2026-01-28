'use client';

import { MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function FloatingWhatsapp() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Sayfa yüklendikten biraz sonra görünsün (Animasyonlu)
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Ayarlardan numara çekilebilir ama şimdilik senin verdiğin numarayı koyuyorum
  const phoneNumber = "905527873513"; 
  const message = "Merhaba, ürünleriniz hakkında bilgi almak istiyorum.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 group transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
    >
      <div className="bg-white px-4 py-2 rounded-lg shadow-lg text-xs font-bold text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block border border-gray-100">
        Bize Sorun 👋
      </div>
      <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 hover:bg-[#20bd5a] text-white">
        <MessageCircle className="h-8 w-8" />
      </div>
      
      {/* Pulse Effect */}
      <div className="absolute top-0 right-0 w-14 h-14 bg-[#25D366] rounded-full -z-10 animate-ping opacity-20"></div>
    </a>
  );
}
