
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import BlogForm from '@/components/dashboard/BlogForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus, Trash2, Eye, Loader2 } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogAction, AlertDialogCancel, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { BlogPost } from '@/types/blog';
import { getBlogPosts, deleteBlogPost } from '@/utils/supabaseBlogClient';

const BlogPostsPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      console.log('Fetching blog posts from Supabase...');
      const data = await getBlogPosts();
      console.log('Blog posts fetched:', data);
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os posts do blog',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = () => {
    setCurrentPost(null);
    setIsFormOpen(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setCurrentPost(post);
    setIsFormOpen(true);
  };

  const handleDeletePost = async (id: string) => {
    try {
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
    fetchPosts();
  };

  const filteredPosts = searchTerm
    ? posts.filter(post => 
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        post.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : posts;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
            <p className="text-muted-foreground">
              Gerencie os conteúdos do blog.
            </p>
          </div>
          <Button onClick={handleCreatePost} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Post
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todos os Posts</CardTitle>
            <CardDescription>
              {posts.length} posts encontrados no blog
            </CardDescription>
            <div className="pt-2">
              <Input
                placeholder="Pesquisar posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                <span>Carregando posts...</span>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                {searchTerm ? 'Nenhum post encontrado para esta pesquisa.' : 'Nenhum post criado ainda.'}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id || post.slug}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.slug}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{post.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {post.date ? new Date(post.date).toLocaleDateString('pt-PT') : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditPost(post)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/blog/${post.slug}`)}
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Excluir post
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o post "{post.title}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => post.id && handleDeletePost(post.id)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {currentPost ? 'Editar Post' : 'Novo Post'}
              </DialogTitle>
              <DialogDescription>
                {currentPost
                  ? 'Edite os detalhes do post existente'
                  : 'Preencha os detalhes para criar um novo post de blog'}
              </DialogDescription>
            </DialogHeader>
            <BlogForm
              initialData={currentPost}
              onSuccess={handleFormClose}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default BlogPostsPage;
