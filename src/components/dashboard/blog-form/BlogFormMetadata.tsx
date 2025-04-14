
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { BlogFormValues } from './types';
import { useLanguage } from '@/contexts/LanguageContext';

interface BlogFormMetadataProps {
  form: UseFormReturn<BlogFormValues>;
}

const BlogFormMetadata: React.FC<BlogFormMetadataProps> = ({ form }) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      {/* Portuguese Metadata */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Metadata em Português</h3>
        <FormField
          control={form.control}
          name="title.pt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Título do post" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="excerpt.pt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resumo</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Breve resumo do artigo para listagens" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* English Metadata */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">English Metadata</h3>
        <FormField
          control={form.control}
          name="title.en"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Post title" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input 
                  placeholder="how-to-improve-seo" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="excerpt.en"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Brief summary of the article for listings" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default BlogFormMetadata;
