
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Image, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface UnsplashSearchFormProps {
  onFetchImages: () => void;
  onTrulyRandomImage: () => void;
  loading: boolean;
}

const UnsplashSearchForm: React.FC<UnsplashSearchFormProps> = ({ 
  onFetchImages, 
  onTrulyRandomImage,
  loading 
}) => {
  const { language } = useLanguage();
  
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-sm font-medium">
        {language === 'pt' ? 'Imagens do Unsplash' : 'Unsplash Images'}
      </h3>
      <div className="flex gap-2">
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          onClick={onTrulyRandomImage}
          disabled={loading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {language === 'pt' ? 'Imagem Aleatória' : 'Random Image'}
        </Button>
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          onClick={onFetchImages}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Image className="h-4 w-4 mr-2" />
          )}
          {language === 'pt' ? 'Buscar Imagens' : 'Search Images'}
        </Button>
      </div>
    </div>
  );
};

export default UnsplashSearchForm;
