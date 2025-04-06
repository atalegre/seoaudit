
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { BlogFormValues } from './types';
import { useLanguage } from '@/contexts/LanguageContext';

interface BlogFormContentProps {
  form: UseFormReturn<BlogFormValues>;
}

const BlogFormContent: React.FC<BlogFormContentProps> = ({ form }) => {
  const { t } = useLanguage();
  
  return (
    <>
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('content')}</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={t('content-placeholder')} 
                {...field}
                className="min-h-[300px] font-mono"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="keyLearning"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>{t('key-learning')}</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={t('key-learning-placeholder')} 
                {...field}
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default BlogFormContent;
