
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { BlogFormValues } from './types';
import { useLanguage } from '@/contexts/LanguageContext';
import ImagePreview from './image-upload/ImagePreview';
import ImageUploadButtons from './image-upload/ImageUploadButtons';
import UnsplashImagePicker from './image-upload/UnsplashImagePicker';
import { useImageUpload } from './image-upload/useImageUpload';

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
  const { 
    fileInputRef, 
    handleFileChange, 
    handleBrowseClick, 
    handleRandomImageClick, 
    handleGenerateThematicImage 
  } = useImageUpload(form);
  
  const handleUnsplashImageSelect = (imageUrl: string) => {
    setImagePreview(imageUrl);
    form.setValue('imageSrc', imageUrl);
    setImageFile(null);
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
                <ImagePreview imagePreview={imagePreview} />
                
                {/* Button group */}
                <ImageUploadButtons 
                  onBrowseClick={handleBrowseClick}
                  onRandomImageClick={handleRandomImageClick}
                  onGenerateThematicImage={handleGenerateThematicImage}
                />
                
                {/* Unsplash image picker component */}
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
