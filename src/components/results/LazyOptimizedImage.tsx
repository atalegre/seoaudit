
import React, { useState, useEffect, useRef } from 'react';

interface LazyOptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholderColor?: string;
  priority?: boolean;
}

const LazyOptimizedImage: React.FC<LazyOptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholderColor = '#f3f4f6',
  priority = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    if (priority || !window.IntersectionObserver) {
      setIsInView(true);
      return;
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // Start loading before image enters viewport
        threshold: 0.01,
      }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [priority]);
  
  // Calculate aspect ratio styles
  const aspectRatioStyle = width && height
    ? { aspectRatio: `${width}/${height}` }
    : {};
    
  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: placeholderColor,
        ...aspectRatioStyle,
      }}
    >
      {isInView && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setIsLoaded(true)}
          fetchPriority={priority ? "high" : "auto"}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};

export default LazyOptimizedImage;
