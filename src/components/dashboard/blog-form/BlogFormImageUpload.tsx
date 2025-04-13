
import React, { useRef } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { BlogFormValues } from './types';
import { Image as ImageIcon, Upload, RefreshCw, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
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
    const tempImg = new Image();
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
                <div className="flex flex-wrap gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleBrowseClick}
                    className="flex-1"
                    size="sm"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {language === 'pt' ? 'Selecionar Imagem' : 'Select Image'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRandomImageClick}
                    title={language === 'pt' ? 'Obter imagem aleatória do Unsplash' : 'Get random image from Unsplash'}
                    size="sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleGenerateThematicImage}
                    className="flex-1"
                    size="sm"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {language === 'pt' ? 'Gerar Imagem Temática' : 'Generate Thematic Image'}
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
