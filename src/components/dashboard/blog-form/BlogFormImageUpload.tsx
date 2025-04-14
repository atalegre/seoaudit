
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { BlogFormValues } from './types';
import { useLanguage } from '@/contexts/LanguageContext';
import ImagePreview from './image-upload/ImagePreview';
import ImageUploadButtons from './image-upload/ImageUploadButtons';
import UnsplashImagePicker from './image-upload/UnsplashImagePicker';
import { useImageUpload } from './image-upload/useImageUpload';
import { toast } from 'sonner';

interface BlogFormImageUploadProps {
  form: UseFormReturn<BlogFormValues>;
  imagePreview: string | null;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const BlogFormImageUpload: React.FC<BlogFormImageUploadProps> = ({ 
  form, 
  imagePreview, 
  setImagePreview, 
  setImageFile 
}) => {
  const { language } = useLanguage();
  const [imageError, setImageError] = useState<string | null>(null);
  
  const { 
    fileInputRef, 
    handleFileChange, 
    handleBrowseClick, 
    handleRandomImageClick, 
    handleGenerateThematicImage,
    isImageLoading
  } = useImageUpload({
    form,
    setImagePreview,
    setImageFile
  });
  
  const handleUnsplashImageSelect = (imageUrl: string) => {
    setImagePreview(imageUrl);
    form.setValue('imageSrc', imageUrl);
    setImageFile(null);
    setImageError(null); // Reset any previous errors
    
    // Log the selection for debugging
    console.log('Selected Unsplash image:', imageUrl);
  };
  
  const handleImageError = (error: string) => {
    setImageError(error);
    console.error('Image error occurred:', error);
    toast.error(language === 'pt' 
      ? 'Erro ao carregar imagem. Usando imagem alternativa.' 
      : 'Error loading image. Using fallback image.');
  };
  
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="imageSrc"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{language === 'pt' ? 'Imagem de Capa' : 'Cover Image'}</FormLabel>
            <FormControl>
              <div className="flex flex-col gap-2">
                <Input 
                  ref={fileInputRef}
                  type="file" 
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {/* Hidden field to store the image URL */}
                <Input 
                  type="hidden" 
                  {...field}
                />
                
                {/* Image preview component */}
                <ImagePreview 
                  imagePreview={imagePreview} 
                  isLoading={isImageLoading}
                  onImageError={handleImageError}
                />
                
                {/* Button group */}
                <ImageUploadButtons 
                  onBrowseClick={handleBrowseClick}
                  onRandomImageClick={handleRandomImageClick}
                  onGenerateThematicImage={handleGenerateThematicImage}
                  isLoading={isImageLoading}
                />
                
                {/* Unsplash image picker component with blog content context */}
                <UnsplashImagePicker 
                  form={form}
                  onImageSelect={handleUnsplashImageSelect}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BlogFormImageUpload;
