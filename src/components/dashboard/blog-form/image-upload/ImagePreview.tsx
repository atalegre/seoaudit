
import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ImagePreviewProps {
  imagePreview: string | null;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imagePreview }) => {
  const { language } = useLanguage();
  
  return (
    <div 
      className="border border-dashed rounded-md bg-muted/50 w-full aspect-video flex items-center justify-center overflow-hidden"
    >
      {imagePreview ? (
        <img 
          src={imagePreview} 
          alt="Preview" 
          className="w-full h-full object-cover"
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
