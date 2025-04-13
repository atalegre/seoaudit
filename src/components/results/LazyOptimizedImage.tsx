
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const LazyOptimizedImage: React.FC<LazyOptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholderColor = '#f3f4f6',
  priority = false,
  fetchPriority = 'auto',
  sizes,
  onLoad,
  onError,
}) => {
  const isMobile = useIsMobile();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    if (onError) onError(e);
  };
  
  // Determine default sizes if not provided
  const defaultSizes = sizes || (isMobile ? '100vw' : '50vw');
  
  // For priority images, use direct rendering without lazy loading
  if (priority) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ backgroundColor: placeholderColor }}>
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleImageLoad}
          onError={handleImageError}
          fetchPriority="high"
          decoding="sync"
          sizes={defaultSizes}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
    );
  }

  // For non-priority images, use native lazy loading
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ backgroundColor: placeholderColor }}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        onLoad={handleImageLoad}
        onError={handleImageError}
        fetchPriority={fetchPriority}
        decoding="async"
        sizes={defaultSizes}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <span className="sr-only">Carregando...</span>
        </div>
      )}
    </div>
  );
};

export default LazyOptimizedImage;
