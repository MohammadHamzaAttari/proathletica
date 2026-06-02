'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface SafeImageProps extends ImageProps {
  fallback?: React.ReactNode;
}

export function SafeImage({ src, alt, fallback, ...props }: SafeImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (fallback as React.ReactElement) || null;
  }

  return (
    <Image
      src={src}
      alt={alt}
      onError={() => setError(true)}
      {...props}
    />
  );
}
