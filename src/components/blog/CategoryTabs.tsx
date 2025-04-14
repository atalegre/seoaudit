
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import BlogGrid from './BlogGrid';
import { BlogPost } from '@/types/blog';

interface CategoryTabsProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  loading: boolean;
  error: string | null;
  filteredPosts: BlogPost[];
  getCategoryColor: (category: string) => string;
  handleImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  categories: string[];
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  setActiveCategory,
  loading,
  error,
  filteredPosts,
  getCategoryColor,
  handleImageError,
  categories
}) => {
  return (
    <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
      <TabsList className="w-full justify-start overflow-auto py-1 h-auto bg-background border-b border-border">
        {categories.map((category) => (
          <TabsTrigger key={category} value={category}>
            {category === 'all' ? 'Todos' : category}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={activeCategory} className="mt-6">
        <BlogGrid 
          loading={loading}
          error={error}
          filteredPosts={filteredPosts}
          getCategoryColor={getCategoryColor}
          handleImageError={handleImageError}
        />
      </TabsContent>
    </Tabs>
  );
};

export default CategoryTabs;
