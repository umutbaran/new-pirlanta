'use client';

import { useState } from 'react';
import { Star, X, Loader2 } from 'lucide-react';

export default function ReviewForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simüle edilmiş kayıt süreci
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="mt-8 text-center">
      <button 
        onClick={() => setIsOpen(true)}
        className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-black border-b border-gray-200 hover:border-black pb-1 transition-all"
      >
        Deneyiminizi Paylaşın
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg p-8 md:p-12 rounded-sm shadow-2xl relative animate-fade-in-up">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Star className="h-8 w-8 fill-current" />
                </div>
                <h3 className="text-2xl font-serif text-gray-900">Teşekkür Ederiz</h3>
                <p className="text-sm text-gray-500 font-light">Değerlendirmeniz onaylandıktan sonra yayınlanacaktır.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-serif text-gray-900 mb-2">Deneyimini Paylaş</h3>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">New Pırlanta Ailesine Katılın</p>
                </div>

                {/* Rating Seçimi */}
                <div className="flex flex-col items-center gap-3 py-4 bg-stone-50 rounded-sm">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Puanınız</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className="transition-transform hover:scale-125"
                      >
                        <Star 
                          className={`h-6 w-6 ${
                            (hover || rating) >= star ? 'text-[#D4AF37] fill-current' : 'text-gray-200'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2 text-left">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Ad Soyad *</label>
                      <input 
                        required 
                        type="text" 
                        className="w-full bg-stone-50 border-none px-4 py-3 text-sm focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
                        placeholder="Adınız Soyadınız"
                      />
                   </div>
                   <div className="space-y-2 text-left">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">E-Posta *</label>
                      <input 
                        required 
                        type="email" 
                        className="w-full bg-stone-50 border-none px-4 py-3 text-sm focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
                        placeholder="ornek@mail.com"
                      />
                   </div>
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Yorumunuz *</label>
                  <textarea 
                    required 
                    rows={4}
                    className="w-full bg-stone-50 border-none px-4 py-3 text-sm focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all resize-none"
                    placeholder="Ürün hakkındaki deneyimlerinizi paylaşın..."
                  ></textarea>
                </div>

                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full bg-[#111] text-white py-4 text-xs font-bold uppercase tracking-[0.3em] hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Gönder'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
