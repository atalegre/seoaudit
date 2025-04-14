
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ContentLayout from '@/components/content/ContentLayout';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Share2, Bookmark, Loader2 } from 'lucide-react';
import BlogSidebar from '@/components/content/BlogSidebar';
import TableOfContents from '@/components/content/TableOfContents';
import { cn } from '@/lib/utils';
import { BlogPost } from '@/types/blog';
import { getBlogPostBySlug } from '@/utils/supabaseBlogClient';
import LazyOptimizedImage from '@/components/results/LazyOptimizedImage';
import { useLanguage } from '@/contexts/LanguageContext';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        navigate('/blog');
        return;
      }
      
      setLoading(true);
      try {
        const postData = await getBlogPostBySlug(slug);
        if (!postData) {
          setError('Post não encontrado');
          navigate('/blog');
          return;
        }
        setPost(postData);
        // Scroll to top when post loads
        window.scrollTo(0, 0);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Erro ao carregar o post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, navigate]);

  // Função para obter uma imagem de fallback quando a imagem principal falhar
  const getDefaultImage = () => {
    const defaultImages = [
      '/placeholder.svg',
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
      'https://images.unsplash.com/photo-1518770660439-4636190af475'
    ];
    return defaultImages[Math.floor(Math.random() * defaultImages.length)];
  };
  
  // Função para lidar com erros de carregamento de imagens
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = getDefaultImage();
  };

  if (loading) {
    return (
      <ContentLayout className="bg-secondary/30">
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando post...</span>
        </div>
      </ContentLayout>
    );
  }

  if (error || !post) {
    return (
      <ContentLayout className="bg-secondary/30">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Post não encontrado</h2>
          <Button asChild>
            <Link to="/blog">Voltar ao Blog</Link>
          </Button>
        </div>
      </ContentLayout>
    );
  }

  // Get content based on current language
  const title = language === 'en' ? post.title.en : post.title.pt;
  const content = language === 'en' 
    ? post.content?.en || post.content?.pt || ''
    : post.content?.pt || post.content?.en || '';
  const keyLearning = language === 'en'
    ? post.keyLearning?.en || post.keyLearning?.pt || ''
    : post.keyLearning?.pt || post.keyLearning?.en || '';

  const getCategoryColor = (category: string = '') => {
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
      default: return 'bg-slate-500 text-white';
    }
  };

  // Create dummy headings for TableOfContents if post doesn't have them
  const headings = post.headings || [
    { id: 'introduction', text: 'Introdução', level: 2 },
    { id: 'content', text: 'Conteúdo', level: 2 },
    { id: 'conclusion', text: 'Conclusão', level: 2 }
  ];

  return (
    <ContentLayout
      sidebar={
        <div className="sticky top-20 space-y-6">
          <TableOfContents headings={headings} />
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
            {post.category || 'Sem categoria'}
          </Badge>

          <h1 className="text-4xl font-bold mb-4 not-prose">{title}</h1>

          <div className="flex items-center text-muted-foreground gap-4 mb-8">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(post.date || new Date()).toLocaleDateString('pt-PT', {
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

          {post.imageSrc && (
            <div className="aspect-video overflow-hidden rounded-lg mb-8">
              <LazyOptimizedImage 
                src={post.imageSrc}
                alt={title}
                className="h-full w-full"
                onError={handleImageError}
                priority={true}
              />
            </div>
          )}

          <div className="content" dangerouslySetInnerHTML={{ __html: content }} />
          
          {keyLearning && (
            <Card className="my-8 p-6 bg-muted/50 border-l-4 border-l-primary not-prose">
              <h3 className="text-xl font-semibold mb-3">Aprendizado chave</h3>
              <div dangerouslySetInnerHTML={{ __html: keyLearning }} />
            </Card>
          )}
          
          {post.tags && post.tags.length > 0 && (
            <div className="border-t pt-6 mt-8">
              <div className="flex flex-wrap gap-2">
                {Array.isArray(post.tags) ? (
                  post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary">
                    {post.tags}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </article>
      </div>
    </ContentLayout>
  );
};

export default BlogPostPage;
