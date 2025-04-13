
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ContentLayout from '@/components/content/ContentLayout';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, Loader2 } from 'lucide-react';
import { categories } from '@/data/blog-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BlogSidebar from '@/components/content/BlogSidebar';
import { cn } from '@/lib/utils';
import { BlogPost } from '@/types/blog';
import { getBlogPosts } from '@/utils/supabaseBlogClient';
import LazyOptimizedImage from '@/components/results/LazyOptimizedImage';

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const posts = await getBlogPosts();
        setBlogPosts(posts);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Não foi possível carregar os posts do blog.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'SEO': return 'bg-seo text-primary-foreground';
      case 'AIO': return 'bg-aio text-primary-foreground';
      case 'IA': return 'bg-indigo-500 text-white';
      case 'AI': return 'bg-indigo-500 text-white';
      case 'Técnico': return 'bg-slate-700 text-white';
      case 'Exemplos': return 'bg-emerald-500 text-white';
      case 'Content Marketing': return 'bg-orange-500 text-white';
      case 'Social Media': return 'bg-blue-500 text-white';
      case 'Email Marketing': return 'bg-green-500 text-white';
      case 'Marketing Digital': return 'bg-orange-500 text-white';
      case 'E-commerce': return 'bg-blue-600 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  const getDefaultImage = () => {
    const defaultImages = [
      '/placeholder.svg',
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
      'https://images.unsplash.com/photo-1518770660439-4636190af475'
    ];
    return defaultImages[Math.floor(Math.random() * defaultImages.length)];
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = getDefaultImage();
  };

  return (
    <ContentLayout
      sidebar={<BlogSidebar />}
      className="bg-background"
    >
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Blog SEO+AI</h1>
          <p className="text-lg text-muted-foreground">
            Artigos, tutoriais e insights sobre SEO e Otimização para Inteligência Artificial
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Pesquisar artigos..." 
            className="pl-10 bg-white/5 border-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveCategory}>
          <TabsList className="w-full justify-start overflow-auto py-1 h-auto bg-background border-b border-border">
            <TabsTrigger value="all">Todos</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                <span>Carregando posts...</span>
              </div>
            ) : error ? (
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
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium">Nenhum artigo encontrado</h3>
                <p className="text-muted-foreground">Tente outra pesquisa ou categoria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <Link to={`/blog/${post.slug}`} key={post.slug} className="group">
                    <Card className="h-full overflow-hidden transition-all hover:shadow-md border border-gray-200">
                      <div className="aspect-video overflow-hidden bg-muted">
                        <LazyOptimizedImage 
                          src={post.imageSrc || getDefaultImage()} 
                          alt={post.title}
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
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <CardDescription className="line-clamp-2">
                          {post.excerpt}
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
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ContentLayout>
  );
};

export default BlogPage;
