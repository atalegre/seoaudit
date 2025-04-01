
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogPost } from '@/types/blog';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Eye, Trash2, Loader2 } from 'lucide-react';
import {
  AlertDialog, AlertDialogContent, AlertDialogAction, AlertDialogCancel,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';

interface BlogPostsTableProps {
  posts: BlogPost[];
  loading: boolean;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
  searchTerm: string;
}

const BlogPostsTable = ({
  posts,
  loading,
  onEdit,
  onDelete,
  searchTerm
}: BlogPostsTableProps) => {
  const navigate = useNavigate();
  
  const filteredPosts = searchTerm
    ? posts.filter(post => 
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        post.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : posts;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Carregando posts...</span>
      </div>
    );
  }

  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        {searchTerm ? 'Nenhum post encontrado para esta pesquisa.' : 'Nenhum post criado ainda.'}
      </div>
    );
  }

  return (
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
                onClick={() => onEdit(post)}
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
                      onClick={() => post.id && onDelete(post.id)}
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
  );
};

export default BlogPostsTable;
