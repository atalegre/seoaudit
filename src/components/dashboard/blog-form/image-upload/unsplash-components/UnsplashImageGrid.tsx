
import React from 'react';
import { Check } from 'lucide-react';
import { UnsplashImage } from '@/utils/blog/unsplashService';

interface UnsplashImageGridProps {
  images: UnsplashImage[];
  selectedImageId: string | null;
  onSelectImage: (image: UnsplashImage) => void;
}

const UnsplashImageGrid: React.FC<UnsplashImageGridProps> = ({ 
  images, 
  selectedImageId, 
  onSelectImage 
}) => {
  if (images.length === 0) return null;
  
  return (
    <div className="grid grid-cols-3 gap-2">
      {images.map((image) => (
        <div 
          key={image.id} 
          className={`relative aspect-video rounded-md overflow-hidden border-2 cursor-pointer transition-all ${
            selectedImageId === image.id ? 'border-primary' : 'border-transparent hover:border-muted'
          }`}
          onClick={() => onSelectImage(image)}
        >
          <img 
            src={image.urls.small} 
            alt={image.alt_description || 'Unsplash image'} 
            className="w-full h-full object-cover"
          />
          {selectedImageId === image.id && (
            <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
              <Check className="h-4 w-4" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UnsplashImageGrid;
