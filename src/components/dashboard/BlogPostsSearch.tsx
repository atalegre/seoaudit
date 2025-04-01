
import React from 'react';
import { Input } from '@/components/ui/input';

interface BlogPostsSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  postsCount: number;
}

const BlogPostsSearch: React.FC<BlogPostsSearchProps> = ({ 
  searchTerm, 
  onSearchChange,
  postsCount
}) => {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-2">
        {postsCount} posts encontrados no blog
      </p>
      <Input
        placeholder="Pesquisar posts..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
};

export default BlogPostsSearch;
