'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Lock, User, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        username: formData.username,
        password: formData.password,
      });

      if (result?.error) {
        setError('Kullanıcı adı veya şifre hatalı.');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError('Sistemle bağlantı kurulamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-4 font-sans text-slate-900">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-[#D4AF37]/5 blur-3xl"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[#D4AF37]/5 blur-3xl"></div>
      </div>

      <div className="w-full max-w-[440px] z-10">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          
          {/* Header */}
          <div className="pt-10 pb-6 px-8 text-center border-b border-slate-50">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4 border border-slate-100">
                <ShieldCheck className="h-8 w-8 text-[#D4AF37]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Yönetim Paneli</h1>
            <p className="text-slate-500 mt-2 text-sm">Lütfen yönetici bilgilerinizi giriniz</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Kullanıcı Adı</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#D4AF37] transition-colors duration-200">
                    <User className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/5 transition-all duration-200 outline-none"
                    placeholder="Kullanıcı adınız"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-semibold text-slate-700">Şifre</label>
                </div>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#D4AF37] transition-colors duration-200">
                    <Lock className="h-5 w-5" />
                  </span>
                  <input
                    type="password"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/5 transition-all duration-200 outline-none"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-70 mt-4 shadow-lg shadow-slate-200"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span>Giriş Yap</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="pb-8 text-center">
             <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
                <span>NEW PIRLANTA</span>
                <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                <span>ADMIN v2.0</span>
             </div>
          </div>
        </div>
        
        <p className="mt-8 text-center text-slate-400 text-xs">
            © 2026 Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
}
