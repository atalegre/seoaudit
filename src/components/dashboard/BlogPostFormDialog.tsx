
import React from 'react';
import { BlogPost } from '@/types/blog';
import BlogForm from '@/components/dashboard/BlogForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BlogPostFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentPost: BlogPost | null;
  onSuccess: () => void;
}

const BlogPostFormDialog: React.FC<BlogPostFormDialogProps> = ({
  isOpen,
  onOpenChange,
  currentPost,
  onSuccess
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostFormDialog;
