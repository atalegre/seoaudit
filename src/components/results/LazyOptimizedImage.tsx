
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { getTrulyRandomUnsplashImage } from '@/utils/blog/unsplashService';

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
  fallbackSrc?: string;
  useRandomFallback?: boolean;
  category?: string; // Optional category for relevant fallback images
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
  fallbackSrc = '/placeholder.svg', // Default fallback
  useRandomFallback = false,
  category,
}) => {
  const isMobile = useIsMobile();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);
  
  // Reset states when source changes
  useEffect(() => {
    setImgSrc(src);
    setIsLoaded(false);
    setHasError(false);
    setRetryCount(0);
  }, [src]);
  
  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  const getRelevantFallbackImage = () => {
    if (category) {
      // If we have a category, generate a more relevant fallback
      const fallbackTopics = {
        'seo': 'seo optimization search engine marketing',
        'aio': 'ai artificial intelligence machine learning',
        'technical-seo': 'web development coding technical',
        'content': 'content writing blog articles',
        'analytics': 'data analytics dashboard charts',
        'updates': 'news digital information updates'
      };
      
      const topic = fallbackTopics[category as keyof typeof fallbackTopics] || 'digital marketing business';
      const timestamp = new Date().getTime();
      return `https://source.unsplash.com/featured/1200x800/?${encodeURIComponent(topic)}&t=${timestamp}`;
    }
    
    return getTrulyRandomUnsplashImage();
  };
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`Image failed to load: ${imgSrc}, retries: ${retryCount}`);
    
    // Try up to 2 times with different fallbacks
    if (retryCount < 2) {
      setRetryCount(prev => prev + 1);
      
      // If random fallback is enabled, use a relevant or random Unsplash image
      if (useRandomFallback) {
        const relevantImage = getRelevantFallbackImage();
        console.log(`Using relevant fallback: ${relevantImage}`);
        setImgSrc(relevantImage);
      } else if (retryCount === 0 && fallbackSrc) {
        // First retry with provided fallback
        setImgSrc(fallbackSrc);
      } else {
        // Second retry with static placeholder
        setImgSrc('/placeholder.svg');
      }
    } else {
      // After maximum retries, set error state
      setHasError(true);
      if (onError) onError(e);
    }
  };
  
  // Determine default sizes if not provided
  const defaultSizes = sizes || (isMobile ? '100vw' : '50vw');
  
  // For priority images, use direct rendering without lazy loading
  if (priority) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ backgroundColor: placeholderColor }}>
        <img
          src={imgSrc}
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
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <span className="text-xs text-muted-foreground">Image not available</span>
          </div>
        )}
      </div>
    );
  }

  // For non-priority images, use native lazy loading
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ backgroundColor: placeholderColor }}>
      <img
        src={imgSrc}
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
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <span className="sr-only">Carregando...</span>
        </div>
      )}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <span className="text-xs text-muted-foreground">Image not available</span>
        </div>
      )}
    </div>
  );
};

export default LazyOptimizedImage;
