
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
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BlogPostsPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
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
        console.log('No posts found in the database');
        // Don't show error toast for empty posts, we'll show a UI message instead
      }
    } catch (error) {
      console.error('Error fetching posts in BlogPostsPage:', error);
      let errorMessage = 'Não foi possível carregar os posts do blog.';
      
      if (error instanceof Error) {
        errorMessage += ` Erro: ${error.message}`;
      }
      
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
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
            {error ? (
              <div className="bg-destructive/20 p-4 rounded-md">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <p className="text-destructive font-medium">Erro ao carregar posts</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{error}</p>
                <Button 
                  onClick={fetchPosts} 
                  variant="outline" 
                  className="mt-4"
                >
                  Tentar novamente
                </Button>
              </div>
            ) : (
              <BlogPostsTable
                posts={posts}
                loading={loading}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
                searchTerm={searchTerm}
              />
            )}
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
