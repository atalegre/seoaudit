
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/types/blog';
import BlogCard from './BlogCard';

interface BlogGridProps {
  loading: boolean;
  error: string | null;
  filteredPosts: BlogPost[];
  getCategoryColor: (category: string) => string;
  handleImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const BlogGrid: React.FC<BlogGridProps> = ({ 
  loading, 
  error, 
  filteredPosts, 
  getCategoryColor, 
  handleImageError 
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Carregando posts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-destructive">{error}</h3>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline" 
          className="mt-4"
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium">Nenhum artigo encontrado</h3>
        <p className="text-muted-foreground">Tente outra pesquisa ou categoria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPosts.map((post) => (
        <BlogCard 
          key={post.slug} 
          post={post} 
          getCategoryColor={getCategoryColor} 
          handleImageError={handleImageError} 
        />
      ))}
    </div>
  );
};

export default BlogGrid;
