
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, Search, X } from 'lucide-react';
import { searchUnsplashImages } from './unsplashService';
import { UnsplashImage } from './types';

interface UnsplashImagePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
  blogTitle: {
    pt: string;
    en: string;
  };
}

const UnsplashImagePicker: React.FC<UnsplashImagePickerProps> = ({ 
  isOpen, 
  onClose, 
  onSelectImage,
  blogTitle
}) => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Set initial search term from blog title when dialog opens
  useEffect(() => {
    if (isOpen) {
      // Use the appropriate language title for search
      const titleText = language === 'en' ? blogTitle.en : blogTitle.pt;
      setSearchQuery(titleText || '');
      
      if (titleText) {
        handleSearch(titleText);
      }
    }
  }, [isOpen, blogTitle, language]);
  
  const handleSearch = async (query: string = searchQuery) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await searchUnsplashImages(query);
      setImages(results);
    } catch (error) {
      console.error('Error searching Unsplash images:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };
  
  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };
  
  const handleConfirmSelection = () => {
    if (selectedImage) {
      onSelectImage(selectedImage);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {language === 'pt' ? 'Escolher imagem do Unsplash' : 'Choose Unsplash Image'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative mb-4">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={language === 'pt' ? 'Buscar imagens...' : 'Search images...'}
            className="pr-24"
          />
          <div className="absolute right-0 top-0 h-full flex items-center">
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSearchQuery('')}
                className="h-full aspect-square"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleSearch()}
              className="h-full aspect-square"
              disabled={isLoading}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image) => (
              <div 
                key={image.id}
                className={`relative aspect-video overflow-hidden rounded-md border cursor-pointer transition-all ${
                  selectedImage === image.urls.regular ? 'ring-2 ring-primary scale-95' : 'hover:scale-95'
                }`}
                onClick={() => handleImageClick(image.urls.regular)}
              >
                <img 
                  src={image.urls.small} 
                  alt={image.alt_description || 'Unsplash image'}
                  className="object-cover w-full h-full"
                />
                {selectedImage === image.urls.regular && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full bg-primary"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {language === 'pt' 
              ? 'Nenhuma imagem encontrada. Tente uma busca diferente.' 
              : 'No images found. Try a different search.'}
          </div>
        )}
        
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            {language === 'pt' ? 'Cancelar' : 'Cancel'}
          </Button>
          <Button 
            onClick={handleConfirmSelection} 
            disabled={!selectedImage}
          >
            {language === 'pt' ? 'Selecionar' : 'Select'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnsplashImagePicker;
