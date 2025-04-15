
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { BlogFormValues } from '../types';

interface UseImageUploadParams {
  form: UseFormReturn<BlogFormValues>;
  initialImageUrl?: string | null;
}

export const useImageUpload = ({ form, initialImageUrl }: UseImageUploadParams) => {
  const { language } = useLanguage();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialImageUrl || null);
  const [isUnsplashOpen, setIsUnsplashOpen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error(language === 'pt' 
        ? 'Por favor, selecione um arquivo de imagem' 
        : 'Please select an image file');
      return;
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(language === 'pt' 
        ? 'O tamanho da imagem deve ser menor que 5MB' 
        : 'Image size must be less than 5MB');
      return;
    }

    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const previewUrl = reader.result as string;
      setImagePreview(previewUrl);
      form.setValue('imageSrc', ''); // Clear the remote URL since we're using a file
      setImageFile(file);
      setImageError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRandomImageClick = () => {
    setIsImageLoading(true);
    // Simulate loading a random placeholder image
    setTimeout(() => {
      const placeholders = [
        'https://images.unsplash.com/photo-1518770660439-4636190af475',
        'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
        'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      ];
      const randomImage = placeholders[Math.floor(Math.random() * placeholders.length)];
      setImagePreview(randomImage);
      form.setValue('imageSrc', randomImage);
      setImageFile(null);
      setImageError(null);
      setIsImageLoading(false);
      
      toast.success(language === 'pt'
        ? 'Imagem aleatória selecionada'
        : 'Random image selected');
    }, 600);
  };

  const handleGenerateThematicImage = () => {
    // This would typically use AI to generate an image based on the blog title
    // For now, we'll just open the Unsplash picker
    setIsUnsplashOpen(true);
  };
  
  const handleUnsplashImageSelect = (imageUrl: string) => {
    setImagePreview(imageUrl);
    form.setValue('imageSrc', imageUrl);
    setImageFile(null);
    setImageError(null); // Reset any previous errors
    setIsUnsplashOpen(false);
    
    toast.success(language === 'pt'
      ? 'Imagem do Unsplash selecionada'
      : 'Unsplash image selected');
  };
  
  const handleImageError = (error: string) => {
    setImageError(error);
    console.error('Image error occurred:', error);
    toast.error(language === 'pt' 
      ? 'Erro ao carregar imagem. Usando imagem alternativa.' 
      : 'Error loading image. Using fallback image.');
  };
  
  // Get the current title for search queries - ensure it's a valid format for search
  const getCurrentTitle = () => {
    const formTitle = form.getValues().title;
    // Ensure we return a valid title object with both pt and en properties 
    return {
      pt: formTitle?.pt || '',
      en: formTitle?.en || ''
    };
  };

  return {
    imageFile,
    setImageFile,
    imagePreview,
    setImagePreview,
    isUnsplashOpen,
    setIsUnsplashOpen,
    isImageLoading,
    imageError,
    fileInputRef,
    handleFileChange,
    handleBrowseClick,
    handleRandomImageClick,
    handleGenerateThematicImage,
    handleUnsplashImageSelect,
    handleImageError,
    getCurrentTitle
  };
};

export default useImageUpload;
