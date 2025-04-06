
import React, { useRef } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { BlogFormValues } from './types';
import { Image, Upload, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
                
                {/* Image preview or placeholder */}
                <div 
                  className="border border-dashed rounded-md bg-muted/50 w-full aspect-video flex items-center justify-center overflow-hidden"
                >
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                      <Image className="w-10 h-10 mb-2" />
                      <p>{language === 'pt' ? 'Nenhuma imagem selecionada' : 'No image selected'}</p>
                    </div>
                  )}
                </div>
                
                {/* Button group */}
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleBrowseClick}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {language === 'pt' ? 'Selecionar Imagem' : 'Select Image'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRandomImageClick}
                    title={language === 'pt' ? 'Obter imagem aleatória do Unsplash' : 'Get random image from Unsplash'}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
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
