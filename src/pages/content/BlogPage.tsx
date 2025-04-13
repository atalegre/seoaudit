
import React, { useState, useEffect } from 'react';
import { BlogPost } from '@/types/blog';
import { getBlogPosts } from '@/utils/supabaseBlogClient';
import BlogHeader from '@/components/blog/BlogHeader';
import SearchInput from '@/components/blog/SearchInput';
import CategoryTabs from '@/components/blog/CategoryTabs';
import CTACard from '@/components/blog/CTACard';

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
    <div className="container mx-auto px-4 py-8 bg-background">
      <div className="space-y-8">
        <BlogHeader 
          title="Blog SEO+AI"
          description="Artigos, tutoriais e insights sobre SEO e Otimização para Inteligência Artificial"
        />

        <SearchInput 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <CategoryTabs 
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          loading={loading}
          error={error}
          filteredPosts={filteredPosts}
          getCategoryColor={getCategoryColor}
          handleImageError={handleImageError}
        />

        <CTACard 
          title="Precisa de ajuda?"
          description="Agende uma consulta gratuita com os nossos especialistas em SEO e AIO."
          buttonText="Fale Conosco"
          linkTo="/contacto"
        />
      </div>
    </div>
  );
};

export default BlogPage;
