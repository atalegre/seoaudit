
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface BlogPostsHeaderProps {
  onCreatePost: () => void;
}

const BlogPostsHeader: React.FC<BlogPostsHeaderProps> = ({ onCreatePost }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
        <p className="text-muted-foreground">
          Gerencie os conteúdos do blog.
        </p>
      </div>
      <Button onClick={onCreatePost} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Novo Post
      </Button>
    </div>
  );
};

export default BlogPostsHeader;
