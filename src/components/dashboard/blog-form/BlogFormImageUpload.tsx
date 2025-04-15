
import React, { useState, useRef } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { BlogFormValues } from './types';
import { useLanguage } from '@/contexts/LanguageContext';
import ImagePreview from './image-upload/ImagePreview';
import ImageUploadButtons from './image-upload/ImageUploadButtons';
import UnsplashImagePicker from './image-upload/UnsplashImagePicker';
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
  const [isUnsplashOpen, setIsUnsplashOpen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const previewUrl = reader.result as string;
      setImagePreview(previewUrl);
      form.setValue('imageSrc', ''); // Clear the remote URL since we're using a file
      setImageFile(file);
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
      setIsImageLoading(false);
    }, 500);
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
  
  // Get the current title for search queries - ensure it's a valid format for search
  const getCurrentTitle = () => {
    const formTitle = form.getValues().title;
    // Ensure we return a valid title object with both pt and en properties
    return {
      pt: formTitle?.pt || '',
      en: formTitle?.en || ''
    };
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
                  onImageError={() => handleImageError('Failed to load image')}
                />
                
                {/* Button group */}
                <ImageUploadButtons 
                  onBrowseClick={handleBrowseClick}
                  onRandomImageClick={handleRandomImageClick}
                  onGenerateThematicImage={handleGenerateThematicImage}
                  isLoading={isImageLoading}
                />
                
                {/* Unsplash image picker dialog */}
                <UnsplashImagePicker 
                  isOpen={isUnsplashOpen}
                  onClose={() => setIsUnsplashOpen(false)}
                  onSelectImage={handleUnsplashImageSelect}
                  blogTitle={getCurrentTitle()}
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
