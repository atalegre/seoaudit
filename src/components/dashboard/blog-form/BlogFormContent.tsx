
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { BlogFormValues } from './types';

interface BlogFormContentProps {
  form: UseFormReturn<BlogFormValues>;
}

const BlogFormContent: React.FC<BlogFormContentProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="content"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Conteúdo (HTML)</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="<h2>Introdução</h2><p>Conteúdo do artigo...</p>" 
              {...field}
              className="min-h-[300px] font-mono"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BlogFormContent;
