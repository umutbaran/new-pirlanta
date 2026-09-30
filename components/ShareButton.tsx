'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    // Mobilde sistemin paylaş menüsünü aç, desteklemiyorsa linki kopyala
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // Kullanıcı paylaşımı iptal etti
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Ürün linkini kopyalayın:', url);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={copied ? 'Link kopyalandı' : 'Ürünü paylaş'}
      title={copied ? 'Link kopyalandı' : 'Paylaş'}
      className="text-gray-300 hover:text-black p-1 shrink-0 transition-colors"
    >
      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Share2 className="h-4 w-4" />}
    </button>
  );
}
