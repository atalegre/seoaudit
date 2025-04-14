
import React, { useState } from 'react';
import { 
  UnsplashImage, 
  searchUnsplashImages, 
  generateSearchTerms, 
  getUnsplashAttribution,
  getTrulyRandomUnsplashImage
} from '@/utils/blog/unsplashService';
import { UseFormReturn } from 'react-hook-form';
import { BlogFormValues } from '../types';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

// Import the new components
import UnsplashSearchForm from './unsplash-components/UnsplashSearchForm';
import UnsplashImageGrid from './unsplash-components/UnsplashImageGrid';
import UnsplashPagination from './unsplash-components/UnsplashPagination';
import UnsplashErrorDisplay from './unsplash-components/UnsplashErrorDisplay';
import UnsplashAttribution from './unsplash-components/UnsplashAttribution';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [lastSearchTerms, setLastSearchTerms] = useState<string>('');
  
  const fetchImagesFromUnsplash = async (page: number = 1) => {
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
      setLastSearchTerms(searchTerms);
      console.log('Fetching Unsplash images for terms:', searchTerms, 'page:', page);
      
      const fetchedImages = await searchUnsplashImages(searchTerms, 3, page);
      
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
        setCurrentPage(page);
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
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      fetchImagesFromUnsplash(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    fetchImagesFromUnsplash(currentPage + 1);
  };
  
  const handleRefreshImages = () => {
    fetchImagesFromUnsplash(Math.floor(Math.random() * 10) + 1); // Random page between 1-10
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
  
  const handleTrulyRandomImage = () => {
    const randomImageUrl = getTrulyRandomUnsplashImage();
    onImageSelect(randomImageUrl);
    toast.success(language === 'pt'
      ? 'Imagem aleatória selecionada'
      : 'Random image selected');
  };
  
  return (
    <div className="space-y-4">
      {/* Search Form Component */}
      <UnsplashSearchForm 
        onFetchImages={() => fetchImagesFromUnsplash(1)}
        onTrulyRandomImage={handleTrulyRandomImage}
        loading={loading}
      />
      
      {/* Error Display Component */}
      <UnsplashErrorDisplay error={error} />
      
      {/* Image Grid */}
      <UnsplashImageGrid 
        images={images}
        selectedImageId={selectedImageId}
        onSelectImage={handleSelectImage}
      />
      
      {/* Pagination */}
      {images.length > 0 && (
        <UnsplashPagination 
          currentPage={currentPage}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
          onRefresh={handleRefreshImages}
          loading={loading}
        />
      )}
      
      {/* Attribution */}
      <UnsplashAttribution showAttribution={images.length > 0} />
    </div>
  );
};

export default UnsplashImagePicker;
