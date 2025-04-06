
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
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('title')}</FormLabel>
            <FormControl>
              <Input 
                placeholder={t('post-title')} 
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
                placeholder="como-melhorar-seo" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="excerpt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('excerpt')}</FormLabel>
            <FormControl>
              <Input 
                placeholder={t('excerpt-placeholder')} 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BlogFormMetadata;
