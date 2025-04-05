
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { blogPosts } from '@/data/blog-data';

const BlogSidebar = () => {
  const { language } = useLanguage();
  
  // Ordenar posts por data (mais recentes primeiro)
  const recentPosts = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Ordenar por popularidade
  const popularPosts = [...blogPosts]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{language === 'pt' ? 'Artigos Recentes' : 'Recent Articles'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 p-4 pt-0">
          {recentPosts.map(post => (
            <Link 
              key={post.slug} 
              to={`/blog/${post.slug}`}
              className="flex items-start py-2 group"
            >
              <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 mr-3">
                <img 
                  src={post.imageSrc} 
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(post.date).toLocaleDateString(language === 'pt' ? 'pt-PT' : 'en-US', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </p>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{language === 'pt' ? 'Mais Populares' : 'Most Popular'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 p-4 pt-0">
          {popularPosts.map(post => (
            <Link 
              key={post.slug} 
              to={`/blog/${post.slug}`}
              className="flex items-start py-2 group"
            >
              <div>
                <h4 className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {post.category}
                </p>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-primary text-primary-foreground">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">{language === 'pt' ? 'Precisa de ajuda?' : 'Need help?'}</h3>
          <p className="text-sm mb-4">{language === 'pt' ? 
            'Agende uma consulta gratuita com os nossos especialistas em SEO e AIO.' : 
            'Schedule a free consultation with our SEO and AIO experts.'}</p>
          <Button asChild variant="secondary" className="w-full">
            <Link to="/contacto" className="flex items-center justify-center gap-2">
              {language === 'pt' ? 'Fale Conosco' : 'Contact Us'} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogSidebar;
