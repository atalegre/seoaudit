
import React, { useState } from 'react';
import { Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTrulyRandomUnsplashImage } from '@/utils/blog/unsplashService';

interface ImagePreviewProps {
  imagePreview: string | null;
  isLoading?: boolean;
  onImageError?: (error: string) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  imagePreview, 
  isLoading = false,
  onImageError
}) => {
  const { language } = useLanguage();
  const [imgError, setImgError] = useState<boolean>(false);
  const [fallbackImage, setFallbackImage] = useState<string | null>(null);
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Log the error for debugging purposes
    console.error("Image failed to load:", imagePreview);
    
    // Set error state
    setImgError(true);
    
    // Notify parent component if callback provided
    if (onImageError) {
      onImageError(`Failed to load image: ${imagePreview}`);
    }
    
    // Generate a fallback image if we don't have one yet
    if (!fallbackImage) {
      const randomImage = getTrulyRandomUnsplashImage();
      setFallbackImage(randomImage);
    }
    
    // Prevent showing broken image
    e.currentTarget.src = fallbackImage || '/placeholder.svg';
  };
  
  // Reset error state when image preview changes
  React.useEffect(() => {
    if (imagePreview) {
      setImgError(false);
    }
  }, [imagePreview]);
  
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
        <>
          <img 
            src={imgError && fallbackImage ? fallbackImage : imagePreview} 
            alt={language === 'pt' ? 'Pré-visualização da imagem' : 'Image preview'} 
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
          
          {imgError && (
            <div className="absolute bottom-2 right-2 bg-destructive/80 text-destructive-foreground text-xs px-2 py-1 rounded-md flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {language === 'pt' ? 'Usando imagem alternativa' : 'Using fallback image'}
            </div>
          )}
        </>
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
