
import React from 'react';
import { Form } from '@/components/ui/form';
import { BlogPost } from '@/types/blog';
import BlogFormMetadata from './BlogFormMetadata';
import BlogFormCategories from './BlogFormCategories';
import BlogFormImageUpload from './BlogFormImageUpload';
import BlogFormContent from './BlogFormContent';
import BlogFormActions from './BlogFormActions';
import { useBlogForm } from './useBlogForm';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { createOptimizedBlogPosts } from '@/services/blog/articleGenerationService';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';

interface BlogFormProps {
  initialData?: BlogPost | null;
  onSuccess?: () => void;
}

const BlogForm: React.FC<BlogFormProps> = ({ initialData = null, onSuccess }) => {
  const { language } = useLanguage();
  const {
    form,
    isSubmitting,
    imageFile,
    setImageFile,
    imagePreview,
    setImagePreview,
    isEditing,
    onSubmit
  } = useBlogForm(initialData, onSuccess);
  
  const handleGenerateOptimizedPosts = async () => {
    try {
      toast.loading(language === 'pt' 
        ? 'Gerando posts otimizados para SEO e LLMs...' 
        : 'Generating posts optimized for SEO and LLMs...');
      
      const result = await createOptimizedBlogPosts();
      
      if (result) {
        toast.success(language === 'pt' 
          ? 'Posts otimizados gerados com sucesso! Atualize a página para ver.' 
          : 'Optimized posts generated successfully! Refresh to see them.');
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(language === 'pt' 
          ? 'Erro ao gerar posts otimizados.' 
          : 'Error generating optimized posts.');
      }
    } catch (error) {
      console.error('Error generating optimized posts:', error);
      toast.error(language === 'pt' 
        ? 'Erro ao gerar posts otimizados.' 
        : 'Error generating optimized posts.');
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <BlogFormMetadata form={form} />
            <BlogFormImageUpload 
              form={form} 
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
              setImageFile={setImageFile}
            />
          </div>
          <div>
            <BlogFormCategories form={form} />
            {!isEditing && (
              <div className="mt-6 border border-dashed border-primary/50 rounded-md p-4 bg-primary/5">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="text-primary h-5 w-5" />
                  <h3 className="font-medium text-sm">
                    {language === 'pt' 
                      ? 'Geração de Conteúdo Otimizado' 
                      : 'Optimized Content Generation'}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {language === 'pt' 
                    ? 'Gere automaticamente 5 artigos otimizados para SEO e LLMs com conteúdo profundo e imagens.' 
                    : 'Automatically generate 5 articles optimized for SEO and LLMs with deep content and images.'}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleGenerateOptimizedPosts}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  {language === 'pt' 
                    ? 'Gerar Posts Otimizados' 
                    : 'Generate Optimized Posts'}
                </Button>
              </div>
            )}
          </div>
        </div>

        <BlogFormContent form={form} />

        <BlogFormActions
          isSubmitting={isSubmitting}
          isEditing={isEditing}
          onCancel={() => onSuccess?.()}
        />
      </form>
    </Form>
  );
};

export default BlogForm;
