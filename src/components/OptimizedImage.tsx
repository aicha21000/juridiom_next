import React, { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    // Optimisation mobile : utiliser des formats modernes
    if (src.includes('.webp') || src.includes('.jpg') || src.includes('.png')) {
      setImageSrc(src);
    } else {
      setImageSrc(src);
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    // Fallback vers une image par défaut en cas d'erreur
    setImageSrc('/src/assets/default-img.jpg');
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      style={{
        transition: 'opacity 0.3s ease',
        width: width,
        height: height
      }}
      loading={priority ? 'eager' : 'lazy'}
      onLoad={handleLoad}
      onError={handleError}
      // Optimisations mobile
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
    />
  );
};

export default OptimizedImage;


