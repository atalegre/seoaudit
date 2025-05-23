
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BlogPost } from '@/types/blog';
import { useLanguage } from '@/contexts/LanguageContext';
import LazyOptimizedImage from '@/components/results/LazyOptimizedImage';

interface BlogCardProps {
  post: BlogPost;
  getCategoryColor: (category: string) => string;
  handleImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, getCategoryColor, handleImageError }) => {
  const { language } = useLanguage();
  
  // Get content based on current language with proper fallbacks
  const title = language === 'en' 
    ? post.title?.en || post.title?.pt || 'Untitled' 
    : post.title?.pt || post.title?.en || 'Sem título';
    
  const excerpt = language === 'en' 
    ? post.excerpt?.en || post.excerpt?.pt || 'No excerpt available'
    : post.excerpt?.pt || post.excerpt?.en || 'Sem descrição disponível';

  return (
    <Link to={`/blog/${post.slug}`} className="group">
      <Card className="h-full overflow-hidden transition-all hover:shadow-md border border-gray-200">
        <div className="aspect-video overflow-hidden bg-muted">
          <LazyOptimizedImage 
            src={post.imageSrc || ''} 
            alt={title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            onError={handleImageError}
          />
        </div>
        <CardHeader className="pb-2">
          <div className="mb-2">
            <Badge className={cn("font-normal", getCategoryColor(post.category || ''))}> 
              {post.category || 'Sem categoria'}
            </Badge>
          </div>
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <CardDescription className="line-clamp-2">
            {excerpt}
          </CardDescription>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground border-t pt-4">
          {post.date ? new Date(post.date).toLocaleDateString('pt-PT', {
            day: 'numeric',
            month: 'long', 
            year: 'numeric'
          }) : 'Data desconhecida'}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BlogCard;
