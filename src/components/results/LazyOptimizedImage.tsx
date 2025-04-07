
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

// Implementação extremamente simplificada para LCP
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
  return (
    <div 
      className={`relative ${className}`}
      style={{
        backgroundColor: placeholderColor,
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
      }}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        onLoad={onLoad}
        fetchPriority={priority ? "high" : fetchPriority}
        decoding="async"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default LazyOptimizedImage;
