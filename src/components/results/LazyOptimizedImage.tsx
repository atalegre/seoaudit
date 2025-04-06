
import React, { useState, useEffect, useRef, memo } from 'react';

interface LazyOptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholderColor?: string;
  priority?: boolean;
  fetchpriority?: 'high' | 'low' | 'auto';
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
  fetchpriority = 'auto',
  sizes = '100vw',
  onLoad,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  
  // Definir dimensões para altura/largura previamente conhecidas
  useEffect(() => {
    // Definir dimensions no placeholder para evitar layout shifts (CLS)
    if (placeholderRef.current && width && height) {
      placeholderRef.current.style.aspectRatio = `${width}/${height}`;
    }
  }, [width, height]);
  
  useEffect(() => {
    // Se é prioritário ou browser não suporta IntersectionObserver, carregar imediatamente
    if (priority || !window.IntersectionObserver) {
      setIsInView(true);
      return;
    }
    
    // Usar margins maiores para começar a carregar antes da imagem entrar em viewport
    const options = {
      rootMargin: '300px', // Carga antecipada - 300px antes do viewport
      threshold: 0.01,
    };
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, options);
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [priority]);
  
  // Calcular aspect ratio styles
  const aspectRatioStyle = width && height
    ? { aspectRatio: `${width}/${height}`, contain: 'layout' }
    : {};
    
  // Implementar formatos next-gen webp quando possível
  const optimizedSrc = src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png')
    ? src.replace(/\.(jpg|jpeg|png)$/, '.webp')
    : src;
    
  // Criar srcset adequado para imagens responsivas
  const createSrcSet = () => {
    if (!width) return undefined;
    
    const baseSrc = optimizedSrc;
    // Gerar tamanhos optimizados de 1x, 2x para diferentes resoluções
    return `${baseSrc} 1x, ${baseSrc.replace(/\.webp$/, '@2x.webp')} 2x`;
  };
  
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
            fetchPriority={priority ? "high" : fetchpriority}
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
