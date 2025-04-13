
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, RefreshCw, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ImageUploadButtonsProps {
  onBrowseClick: () => void;
  onRandomImageClick: () => void;
  onGenerateThematicImage: () => void;
}

const ImageUploadButtons: React.FC<ImageUploadButtonsProps> = ({ 
  onBrowseClick, 
  onRandomImageClick, 
  onGenerateThematicImage 
}) => {
  const { language } = useLanguage();
  
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onBrowseClick}
        className="flex-1"
        size="sm"
      >
        <Upload className="w-4 h-4 mr-2" />
        {language === 'pt' ? 'Selecionar Imagem' : 'Select Image'}
      </Button>
      
      <Button
        type="button"
        variant="outline"
        onClick={onRandomImageClick}
        title={language === 'pt' ? 'Obter imagem aleatória do Unsplash' : 'Get random image from Unsplash'}
        size="sm"
      >
        <RefreshCw className="w-4 h-4" />
      </Button>
      
      <Button
        type="button"
        variant="secondary"
        onClick={onGenerateThematicImage}
        className="flex-1"
        size="sm"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        {language === 'pt' ? 'Gerar Imagem Temática' : 'Generate Thematic Image'}
      </Button>
    </div>
  );
};

export default ImageUploadButtons;
