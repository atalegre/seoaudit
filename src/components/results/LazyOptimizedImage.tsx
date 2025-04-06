
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
  
  // Otimizar Intersection Observer com configuração simplificada
  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }
    
    const options = {
      rootMargin: '100px',
      threshold: 0,
    };
    
    let observer: IntersectionObserver;
    const currentElement = imgRef.current;
    
    if (currentElement && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      }, options);
      
      observer.observe(currentElement);
    } else {
      // Fallback para navegadores sem suporte a IntersectionObserver
      setIsInView(true);
    }
    
    return () => {
      if (observer && currentElement) {
        observer.disconnect();
      }
    };
  }, [priority]);
  
  // Simplificar aspectRatio para evitar recálculos
  const aspectRatioStyle = (width && height) ? { aspectRatio: `${width}/${height}` } : {};
    
  // Otimizar src para webp apenas quando necessário
  const optimizedSrc = src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png')
    ? src.replace(/\.(jpg|jpeg|png)$/, '.webp')
    : src;
    
  // Simplificar srcSet para melhorar performance
  const srcSet = width ? `${optimizedSrc} 1x, ${optimizedSrc.replace(/\.webp$/, '@2x.webp')} 2x` : undefined;
  
  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  // Renderizar placeholder simples se não estiver carregado
  if (!isInView) {
    return (
      <div 
        className={`relative overflow-hidden ${className}`}
        style={{
          backgroundColor: placeholderColor,
          ...aspectRatioStyle,
          minHeight: height ? `${height}px` : 'auto',
        }}
      />
    );
  }
  
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: placeholderColor,
        ...aspectRatioStyle,
      }}
    >
      <img
        ref={imgRef}
        src={optimizedSrc}
        srcSet={srcSet}
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
      />
    </div>
  );
});

LazyOptimizedImage.displayName = 'LazyOptimizedImage';

export default LazyOptimizedImage;
