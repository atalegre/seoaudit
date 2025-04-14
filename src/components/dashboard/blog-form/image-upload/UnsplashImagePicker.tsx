
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Image, Check, RefreshCw } from 'lucide-react';
import { 
  UnsplashImage, 
  searchUnsplashImages, 
  generateSearchTerms, 
  getUnsplashAttribution,
  getRandomUnsplashImage 
} from '@/utils/blog/unsplashService';
import { UseFormReturn } from 'react-hook-form';
import { BlogFormValues } from '../types';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface UnsplashImagePickerProps {
  form: UseFormReturn<BlogFormValues>;
  onImageSelect: (imageUrl: string) => void;
}

const UnsplashImagePicker: React.FC<UnsplashImagePickerProps> = ({ form, onImageSelect }) => {
  const { language } = useLanguage();
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  
  const fetchImagesFromUnsplash = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const title = form.getValues('title');
      const category = form.getValues('category');
      const content = form.getValues('content');
      
      if (!title) {
        toast.error(language === 'pt' 
          ? 'Adicione um título para gerar imagens' 
          : 'Add a title to generate images');
        setLoading(false);
        return;
      }
      
      const searchTerms = generateSearchTerms(title, category, content);
      console.log('Fetching Unsplash images for terms:', searchTerms);
      
      const fetchedImages = await searchUnsplashImages(searchTerms);
      
      if (fetchedImages.length === 0) {
        setError(language === 'pt'
          ? 'Não foram encontradas imagens. Tente termos diferentes ou use a opção aleatória.'
          : 'No images found. Try different terms or use the random option.');
        toast.error(language === 'pt'
          ? 'Não foram encontradas imagens. Tente termos diferentes.'
          : 'No images found. Try different terms.');
      } else {
        setImages(fetchedImages);
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching Unsplash images:', error);
      setError(language === 'pt'
        ? `Erro ao buscar imagens: ${error.message || 'Falha na API'}`
        : `Error fetching images: ${error.message || 'API failure'}`);
      toast.error(language === 'pt'
        ? 'Erro ao buscar imagens do Unsplash'
        : 'Error fetching images from Unsplash');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectImage = (image: UnsplashImage) => {
    setSelectedImageId(image.id);
    onImageSelect(image.urls.regular);
    
    // Store attribution in form data if needed
    const attribution = getUnsplashAttribution(image);
    console.log('Image attribution:', attribution);
    
    toast.success(language === 'pt'
      ? 'Imagem selecionada'
      : 'Image selected');
  };
  
  const handleUseFallbackImage = () => {
    const title = form.getValues('title');
    const category = form.getValues('category');
    
    if (!title) {
      toast.error(language === 'pt' 
        ? 'Adicione um título para gerar uma imagem' 
        : 'Add a title to generate an image');
      return;
    }
    
    const searchTerms = generateSearchTerms(title, category, '');
    const randomImageUrl = getRandomUnsplashImage(searchTerms);
    
    onImageSelect(randomImageUrl);
    toast.success(language === 'pt'
      ? 'Imagem aleatória selecionada'
      : 'Random image selected');
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">
          {language === 'pt' ? 'Imagens do Unsplash' : 'Unsplash Images'}
        </h3>
        <div className="flex gap-2">
          <Button 
            type="button" 
            size="sm" 
            variant="outline" 
            onClick={handleUseFallbackImage}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {language === 'pt' ? 'Imagem Aleatória' : 'Random Image'}
          </Button>
          <Button 
            type="button" 
            size="sm" 
            variant="outline" 
            onClick={fetchImagesFromUnsplash}
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
      
      {error && (
        <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}
      
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((image) => (
            <div 
              key={image.id} 
              className={`relative aspect-video rounded-md overflow-hidden border-2 cursor-pointer transition-all ${
                selectedImageId === image.id ? 'border-primary' : 'border-transparent hover:border-muted'
              }`}
              onClick={() => handleSelectImage(image)}
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
      )}
      
      {images.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {language === 'pt' 
            ? 'Clique em uma imagem para selecioná-la. Imagens fornecidas pelo Unsplash.'
            : 'Click on an image to select it. Images provided by Unsplash.'}
        </p>
      )}
    </div>
  );
};

export default UnsplashImagePicker;
