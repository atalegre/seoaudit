
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, RefreshCw, Sparkles, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ImageUploadButtonsProps {
  onBrowseClick: () => void;
  onRandomImageClick: () => void;
  onGenerateThematicImage: () => void;
  isLoading?: boolean;
}

const ImageUploadButtons: React.FC<ImageUploadButtonsProps> = ({ 
  onBrowseClick, 
  onRandomImageClick, 
  onGenerateThematicImage,
  isLoading = false
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
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
        {language === 'pt' ? 'Selecionar Imagem' : 'Select Image'}
      </Button>
      
      <Button
        type="button"
        variant="outline"
        onClick={onRandomImageClick}
        title={language === 'pt' ? 'Obter imagem aleatória do Unsplash' : 'Get random image from Unsplash'}
        size="sm"
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
      </Button>
      
      <Button
        type="button"
        variant="secondary"
        onClick={onGenerateThematicImage}
        className="flex-1"
        size="sm"
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
        {language === 'pt' ? 'Gerar Imagem Temática' : 'Generate Thematic Image'}
      </Button>
    </div>
  );
};

export default ImageUploadButtons;
