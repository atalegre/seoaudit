
import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ContentLayout from '@/components/content/ContentLayout';
import { blogPosts } from '@/data/blog-data';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Share2, Bookmark } from 'lucide-react';
import BlogSidebar from '@/components/content/BlogSidebar';
import TableOfContents from '@/components/content/TableOfContents';
import { cn } from '@/lib/utils';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = blogPosts.find(post => post.slug === slug);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    // If post doesn't exist, redirect to blog
    if (!post && slug) {
      navigate('/blog');
    }
  }, [post, slug, navigate]);

  if (!post) {
    return null;
  }

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
      sidebar={
        <div className="sticky top-20 space-y-6">
          <TableOfContents headings={post.headings} />
          <BlogSidebar />
        </div>
      }
      className="bg-secondary/30"
    >
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/blog" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Voltar ao Blog
            </Link>
          </Button>
        </div>
        
        <article className="prose prose-slate max-w-none">
          <Badge className={cn("mb-4 font-normal", getCategoryColor(post.category))}>
            {post.category}
          </Badge>

          <h1 className="text-4xl font-bold mb-4 not-prose">{post.title}</h1>

          <div className="flex items-center text-muted-foreground gap-4 mb-8">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString('pt-PT', {
                day: 'numeric',
                month: 'long', 
                year: 'numeric'
              })}
            </div>
            
            <div className="flex gap-2 ml-auto">
              <Button variant="ghost" size="icon" title="Guardar">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Partilhar">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="aspect-video overflow-hidden rounded-lg mb-8">
            <img 
              src={post.imageSrc} 
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="content" dangerouslySetInnerHTML={{ __html: post.content }} />
          
          <Card className="my-8 p-6 bg-muted/50 border-l-4 border-l-primary not-prose">
            <h3 className="text-xl font-semibold mb-3">Aprendizado chave</h3>
            <div dangerouslySetInnerHTML={{ __html: post.keyLearning }} />
          </Card>
          
          <div className="border-t pt-6 mt-8">
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </article>
      </div>
    </ContentLayout>
  );
};

export default BlogPostPage;
