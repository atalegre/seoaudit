
import React from 'react';
import { BlogPost } from '@/types/blog';
import BlogForm from '@/components/dashboard/BlogForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

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
        <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">
                {currentPost ? 'Editar Post' : 'Novo Post'}
              </DialogTitle>
              <DialogDescription>
                {currentPost
                  ? 'Edite os detalhes do post existente'
                  : 'Preencha os detalhes para criar um novo post de blog'}
              </DialogDescription>
            </div>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="h-4 w-4" />
                <span className="sr-only">Fechar</span>
              </Button>
            </DialogClose>
          </div>
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
