
import React from 'react';

interface LazyOptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholderColor?: string;
  priority?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
  sizes?: string;
  onLoad?: () => void;
}

// Implementação extremamente otimizada para LCP
const LazyOptimizedImage: React.FC<LazyOptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholderColor = '#f3f4f6',
  priority = false,
  fetchPriority = 'auto',
  onLoad,
}) => {
  // Para imagens prioritárias, renderização simples e direta sem lazy loading
  if (priority) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoad={onLoad}
        fetchPriority="high"
        decoding="sync"
        className={`w-full h-full object-cover ${className}`}
        style={{
          backgroundColor: placeholderColor,
        }}
      />
    );
  }

  // Para imagens não-prioritárias, usar loading="lazy" e nativo
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      onLoad={onLoad}
      fetchPriority={fetchPriority}
      decoding="async"
      className={`w-full h-full object-cover ${className}`}
      style={{
        backgroundColor: placeholderColor,
      }}
    />
  );
};

export default LazyOptimizedImage;
