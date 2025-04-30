
import React, { useState, useEffect } from 'react';
import { BlogPost } from '@/types/blog';
import { getBlogPosts } from '@/utils/supabaseBlogClient';
import { useLanguage } from '@/contexts/LanguageContext';
import BlogHeader from '@/components/blog/BlogHeader';
import SearchInput from '@/components/blog/SearchInput';
import CategoryTabs from '@/components/blog/CategoryTabs';
import CTACard from '@/components/blog/CTACard';
import ContentLayout from '@/components/content/ContentLayout';
import BlogGrid from '@/components/blog/BlogGrid';

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(['all']);
  const { language } = useLanguage();
  
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const posts = await getBlogPosts();
      setBlogPosts(posts);
      
      // Extract unique categories from posts
      const uniqueCategories = Array.from(
        new Set(posts.map(post => post.category).filter(Boolean))
      ) as string[];
      
      setCategories(['all', ...uniqueCategories]);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Não foi possível carregar os posts do blog.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    
    const postTitle = language === 'en' 
      ? post.title?.en || post.title?.pt || '' 
      : post.title?.pt || post.title?.en || '';
      
    const postExcerpt = language === 'en' 
      ? post.excerpt?.en || post.excerpt?.pt || '' 
      : post.excerpt?.pt || post.excerpt?.en || '';
    
    const matchesSearch = searchQuery === '' || 
      postTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      postExcerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    if (!category) return 'bg-slate-500 text-white';
    
    switch (category.toLowerCase()) {
      case 'seo': return 'bg-seo text-primary-foreground';
      case 'aio': return 'bg-aio text-primary-foreground';
      case 'technical-seo': case 'seo técnico': return 'bg-slate-700 text-white';
      case 'content': case 'conteúdo': return 'bg-emerald-500 text-white';
      case 'analytics': return 'bg-indigo-500 text-white';
      case 'updates': case 'atualizações': return 'bg-orange-500 text-white';
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
    <ContentLayout>
      <div className="space-y-8">
        <BlogHeader 
          title="Blog SEO+AI"
          description="Artigos, tutoriais e insights sobre SEO e Otimização para Inteligência Artificial"
        />

        <SearchInput 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <BlogGrid 
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
    </ContentLayout>
  );
};

export default BlogPage;
