
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ContentLayout from '@/components/content/ContentLayout';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { blogPosts, categories } from '@/data/blog-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BlogSidebar from '@/components/content/BlogSidebar';

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Filtrar posts por categoria e pesquisa
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'SEO': return 'bg-seo text-primary-foreground';
      case 'AIO': return 'bg-aio text-primary-foreground';
      case 'IA': return 'bg-indigo-500 text-white';
      case 'Técnico': return 'bg-slate-700 text-white';
      case 'Exemplos': return 'bg-emerald-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <ContentLayout
      sidebar={<BlogSidebar />}
      className="bg-secondary/30"
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
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveCategory}>
          <TabsList className="w-full justify-start overflow-auto py-1 h-auto">
            <TabsTrigger value="all">Todos</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-6">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium">Nenhum artigo encontrado</h3>
                <p className="text-muted-foreground">Tente outra pesquisa ou categoria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <Link to={`/blog/${post.slug}`} key={post.slug} className="group">
                    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                      <div className="aspect-video overflow-hidden bg-muted">
                        <img 
                          src={post.imageSrc} 
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="mb-2">
                          <Badge className={cn("font-normal", getCategoryColor(post.category))}>
                            {post.category}
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
                        {new Date(post.date).toLocaleDateString('pt-PT', {
                          day: 'numeric',
                          month: 'long', 
                          year: 'numeric'
                        })}
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
