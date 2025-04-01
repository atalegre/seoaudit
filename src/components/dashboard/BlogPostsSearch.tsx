
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

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
        {postsCount > 0 
          ? `${postsCount} post${postsCount > 1 ? 's' : ''} encontrado${postsCount > 1 ? 's' : ''} no blog` 
          : "0 posts encontrados no blog"}
      </p>
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar posts..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  );
};

export default BlogPostsSearch;
