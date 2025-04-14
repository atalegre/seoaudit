
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Brain } from 'lucide-react';
import { toast } from 'sonner';
import { createOptimizedBlogPosts } from '@/services/blog/articleGenerationService';
import { useLanguage } from '@/contexts/LanguageContext';

interface BlogPostsHeaderProps {
  onCreatePost: () => void;
}

const BlogPostsHeader: React.FC<BlogPostsHeaderProps> = ({ onCreatePost }) => {
  const { language } = useLanguage();
  const [isGenerating, setIsGenerating] = React.useState(false);
  
  const handleGenerateOptimizedPosts = async () => {
    try {
      setIsGenerating(true);
      toast.loading(language === 'pt' 
        ? 'Gerando posts super completos otimizados para SEO e LLMs...' 
        : 'Generating comprehensive posts optimized for SEO and LLMs...');
      
      const result = await createOptimizedBlogPosts();
      
      if (result) {
        toast.success(language === 'pt' 
          ? 'Posts otimizados gerados com sucesso! Atualize a página para ver.' 
          : 'Optimized posts generated successfully! Refresh to see them.');
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
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
        <p className="text-muted-foreground">
          Gerencie os conteúdos do blog.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          variant="outline"
          onClick={handleGenerateOptimizedPosts} 
          className="flex items-center gap-2"
          disabled={isGenerating}
        >
          <Brain className="h-4 w-4" />
          {isGenerating ? 'Gerando posts...' : 'Gerar Posts Otimizados'}
        </Button>
        <Button 
          onClick={onCreatePost} 
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Post
        </Button>
      </div>
    </div>
  );
};

export default BlogPostsHeader;
