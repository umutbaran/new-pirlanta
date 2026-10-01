'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

/**
 * next/image sarmalayıcısı: görsel yoksa veya yüklenemezse (ör. silinmiş harici görsel)
 * kırık ikon yerine marka logolu, sade bir yer tutucu gösterir.
 */
export default function SmartImage({ src, alt, className, ...props }: Omit<ImageProps, 'src'> & { src?: string | null }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={cn('absolute inset-0 flex items-center justify-center bg-ivory', props.fill ? '' : 'relative')} role="img" aria-label={alt}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logo-mark.png" alt="" className="w-1/5 max-w-16 opacity-15 grayscale" />
      </div>
    );
  }

  return <Image src={src} alt={alt} className={className} onError={() => setFailed(true)} {...props} />;
}
