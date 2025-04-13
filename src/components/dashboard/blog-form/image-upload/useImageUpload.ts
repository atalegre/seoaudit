
import { useState, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BlogFormValues } from '../types';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

export const useImageUpload = (form: UseFormReturn<BlogFormValues>) => {
  const { language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRandomImageClick = () => {
    // Get a random Unsplash image optimized for blog content
    const randomSearchTerms = ['seo', 'digital', 'computer', 'marketing', 'business', 'technology', 'data', 'ai'];
    const randomTerm = randomSearchTerms[Math.floor(Math.random() * randomSearchTerms.length)];
    const randomImage = `https://source.unsplash.com/random/1200x800/?${randomTerm}`;
    
    setImagePreview(randomImage);
    form.setValue('imageSrc', randomImage);
  };
  
  const handleGenerateThematicImage = () => {
    // Generate image based on title and category
    const title = form.getValues('title');
    const category = form.getValues('category');
    
    if (!title) {
      toast.error(language === 'pt' 
        ? 'Adicione um título para gerar uma imagem temática' 
        : 'Add a title to generate a thematic image');
      return;
    }
    
    const searchQuery = `${category || ''} ${title}`.trim();
    const encodedQuery = encodeURIComponent(searchQuery);
    const timestamp = new Date().getTime(); // Add timestamp to avoid caching
    const thematicImage = `https://source.unsplash.com/featured/1200x800/?${encodedQuery}&t=${timestamp}`;
    
    toast.info(language === 'pt' 
      ? 'Gerando imagem temática...' 
      : 'Generating thematic image...');
    
    // Correctly create and use Image object
    const tempImg = new window.Image();
    tempImg.onload = () => {
      setImagePreview(thematicImage);
      form.setValue('imageSrc', thematicImage);
      toast.success(language === 'pt' 
        ? 'Imagem temática gerada com sucesso!' 
        : 'Thematic image generated successfully!');
    };
    tempImg.onerror = () => {
      // Fallback to a different search term if the specific one fails
      const fallbackImage = `https://source.unsplash.com/featured/1200x800/?${category || 'blog'}&t=${timestamp}`;
      setImagePreview(fallbackImage);
      form.setValue('imageSrc', fallbackImage);
      toast.success(language === 'pt' 
        ? 'Imagem alternativa gerada!' 
        : 'Alternative image generated!');
    };
    tempImg.src = thematicImage; // This is crucial to trigger loading
  };
  
  return {
    imageFile,
    setImageFile,
    imagePreview,
    setImagePreview,
    fileInputRef,
    handleFileChange,
    handleBrowseClick,
    handleRandomImageClick,
    handleGenerateThematicImage
  };
};
