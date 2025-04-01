
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import BlogPostsHeader from '@/components/dashboard/BlogPostsHeader';
import BlogPostsTable from '@/components/dashboard/BlogPostsTable';
import BlogPostFormDialog from '@/components/dashboard/BlogPostFormDialog';
import BlogPostsSearch from '@/components/dashboard/BlogPostsSearch';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BlogPost } from '@/types/blog';
import { getBlogPosts, deleteBlogPost } from '@/utils/supabaseBlogClient';

const BlogPostsPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchPosts = async () => {
    setLoading(true);
    console.log('Starting to fetch blog posts...');
    try {
      console.log('Calling getBlogPosts function...');
      const data = await getBlogPosts();
      console.log('Response from getBlogPosts:', data);
      setPosts(data || []);
      if (data && data.length > 0) {
        toast({
          title: 'Posts carregados',
          description: `${data.length} posts foram carregados com sucesso.`,
        });
      } else {
        toast({
          title: 'Nenhum post encontrado',
          description: 'Não foram encontrados posts no banco de dados.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching posts in BlogPostsPage:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os posts do blog. Verifique o console para mais detalhes.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      console.log('Fetch posts completed. Loading state set to false.');
    }
  };

  useEffect(() => {
    console.log('BlogPostsPage: useEffect triggered, fetching posts...');
    fetchPosts();
  }, []);

  const handleCreatePost = () => {
    setCurrentPost(null);
    setIsFormOpen(true);
  };

  const handleEditPost = (post: BlogPost) => {
    console.log('Editing post:', post);
    setCurrentPost(post);
    setIsFormOpen(true);
  };

  const handleDeletePost = async (id: string) => {
    try {
      console.log(`Deleting post with id: ${id}`);
      await deleteBlogPost(id);
      
      toast({
        title: 'Post excluído',
        description: 'O post foi excluído com sucesso',
      });
      
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o post',
        variant: 'destructive',
      });
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    console.log('Form closed, fetching updated posts...');
    fetchPosts();
  };

  console.log('Current posts state:', posts);
  console.log('Current loading state:', loading);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <BlogPostsHeader onCreatePost={handleCreatePost} />

        <Card>
          <CardHeader>
            <CardTitle>Todos os Posts</CardTitle>
            <BlogPostsSearch 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              postsCount={posts.length}
            />
          </CardHeader>
          <CardContent>
            <BlogPostsTable
              posts={posts}
              loading={loading}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              searchTerm={searchTerm}
            />
          </CardContent>
        </Card>

        <BlogPostFormDialog
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
          currentPost={currentPost}
          onSuccess={handleFormClose}
        />
      </div>
    </DashboardLayout>
  );
};

export default BlogPostsPage;
