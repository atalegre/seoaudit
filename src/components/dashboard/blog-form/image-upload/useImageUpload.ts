
import { useState, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BlogFormValues } from '../types';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { getTrulyRandomUnsplashImage, generateSearchTerms } from '@/utils/blog/unsplashService';

export const useImageUpload = (form: UseFormReturn<BlogFormValues>) => {
  const { language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
        // Ensure the form value is updated
        form.setValue('imageSrc', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const loadImageWithFallback = (imageUrl: string, description: string) => {
    setIsImageLoading(true);
    const tempImg = new window.Image();
    tempImg.onload = () => {
      setImagePreview(imageUrl);
      form.setValue('imageSrc', imageUrl);
      setIsImageLoading(false);
      toast.success(language === 'pt' 
        ? `${description} selecionada!` 
        : `${description} selected!`);
    };
    tempImg.onerror = () => {
      // Fallback to a different random image
      console.error(`Failed to load image: ${imageUrl}`);
      const fallbackImage = getTrulyRandomUnsplashImage();
      setImagePreview(fallbackImage);
      form.setValue('imageSrc', fallbackImage);
      setIsImageLoading(false);
      toast.success(language === 'pt' 
        ? 'Imagem alternativa gerada!' 
        : 'Alternative image generated!');
    };
    // Set a timeout to prevent hanging
    setTimeout(() => {
      if (tempImg.complete === false) {
        tempImg.src = ''; // Cancel loading
        const fallbackImage = getTrulyRandomUnsplashImage();
        setImagePreview(fallbackImage);
        form.setValue('imageSrc', fallbackImage);
        setIsImageLoading(false);
        toast.info(language === 'pt' 
          ? 'Timeout ao carregar imagem, usando alternativa' 
          : 'Image loading timeout, using alternative');
      }
    }, 8000);
    
    tempImg.src = imageUrl; // This triggers loading
  };

  const handleRandomImageClick = () => {
    // Get a truly random Unsplash image
    const randomImage = getTrulyRandomUnsplashImage();
    loadImageWithFallback(randomImage, language === 'pt' ? 'Imagem aleatória' : 'Random image');
  };
  
  const handleGenerateThematicImage = () => {
    // Generate image based on title and category
    const title = form.getValues('title');
    const category = form.getValues('category');
    const content = form.getValues('content');
    
    if (!title) {
      toast.error(language === 'pt' 
        ? 'Adicione um título para gerar uma imagem temática' 
        : 'Add a title to generate a thematic image');
      return;
    }
    
    // Use the improved generateSearchTerms function that analyzes content
    const searchQuery = generateSearchTerms(title, category, content);
    const timestamp = new Date().getTime(); // Add timestamp to avoid caching
    const thematicImage = `https://source.unsplash.com/featured/1200x800/?${encodeURIComponent(searchQuery)}&t=${timestamp}`;
    
    toast.info(language === 'pt' 
      ? 'Gerando imagem temática...' 
      : 'Generating thematic image...');
    
    loadImageWithFallback(thematicImage, language === 'pt' ? 'Imagem temática' : 'Thematic image');
  };
  
  return {
    imageFile,
    setImageFile,
    imagePreview,
    setImagePreview,
    fileInputRef,
    isImageLoading,
    handleFileChange,
    handleBrowseClick,
    handleRandomImageClick,
    handleGenerateThematicImage
  };
};
