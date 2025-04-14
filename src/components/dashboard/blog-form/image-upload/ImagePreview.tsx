
import React from 'react';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ImagePreviewProps {
  imagePreview: string | null;
  isLoading?: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imagePreview, isLoading = false }) => {
  const { language } = useLanguage();
  
  return (
    <div 
      className="border border-dashed rounded-md bg-muted/50 w-full aspect-video flex items-center justify-center overflow-hidden relative"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      )}
      
      {imagePreview ? (
        <img 
          src={imagePreview} 
          alt="Preview" 
          className="w-full h-full object-cover"
          onError={(e) => {
            // If image fails to load, replace with error state
            console.error("Image failed to load:", imagePreview);
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
          <ImageIcon className="w-10 h-10 mb-2" />
          <p>{language === 'pt' ? 'Nenhuma imagem selecionada' : 'No image selected'}</p>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
