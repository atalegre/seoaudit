
import React, { useState, useEffect, useRef, memo } from 'react';

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

const LazyOptimizedImage: React.FC<LazyOptimizedImageProps> = memo(({
  src,
  alt,
  width,
  height,
  className = '',
  placeholderColor = '#f3f4f6',
  priority = false,
  fetchPriority = 'auto',
  sizes = '100vw',
  onLoad,
}) => {
  const [isLoaded, setIsLoaded] = useState(priority);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  
  // Configurar aspect ratio apenas uma vez
  useEffect(() => {
    if (placeholderRef.current && width && height) {
      placeholderRef.current.style.aspectRatio = `${width}/${height}`;
    }
  }, [width, height]);
  
  // Otimizar Intersection Observer com cleanup adequado
  useEffect(() => {
    if (priority || !window.IntersectionObserver) {
      setIsInView(true);
      return;
    }
    
    const options = {
      rootMargin: '300px',
      threshold: 0.01,
    };
    
    let observer: IntersectionObserver;
    const currentElement = imgRef.current;
    
    if (currentElement) {
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      }, options);
      
      observer.observe(currentElement);
    }
    
    return () => {
      if (observer && currentElement) {
        observer.disconnect();
      }
    };
  }, [priority]);
  
  const aspectRatioStyle = width && height
    ? { aspectRatio: `${width}/${height}`, contain: 'layout' }
    : {};
    
  // Memoizar a URL otimizada para evitar recálculos
  const optimizedSrc = React.useMemo(() => {
    return src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png')
      ? src.replace(/\.(jpg|jpeg|png)$/, '.webp')
      : src;
  }, [src]);
    
  const createSrcSet = React.useCallback(() => {
    if (!width) return undefined;
    
    const baseSrc = optimizedSrc;
    return `${baseSrc} 1x, ${baseSrc.replace(/\.webp$/, '@2x.webp')} 2x`;
  }, [optimizedSrc, width]);
  
  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  return (
    <div 
      ref={placeholderRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: placeholderColor,
        ...aspectRatioStyle,
      }}
    >
      <div 
        ref={imgRef}
        className="w-full h-full"
        style={{ minHeight: height ? `${height}px` : 'auto' }}
      >
        {isInView && (
          <img
            src={optimizedSrc}
            srcSet={createSrcSet()}
            sizes={sizes}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? "eager" : "lazy"}
            onLoad={handleImageLoad}
            fetchPriority={priority ? "high" : fetchPriority}
            decoding={priority ? "sync" : "async"}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ contain: 'paint' }}
          />
        )}
      </div>
    </div>
  );
});

LazyOptimizedImage.displayName = 'LazyOptimizedImage';

export default LazyOptimizedImage;
