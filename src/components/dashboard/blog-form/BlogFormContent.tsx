
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
  const { language, t } = useLanguage();
  
  return (
    <>
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{language === 'pt' ? 'Conteúdo (HTML)' : 'Content (HTML)'}</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={language === 'pt' 
                  ? "<h2>Introdução</h2><p>Conteúdo do artigo...</p>" 
                  : "<h2>Introduction</h2><p>Article content...</p>"} 
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
            <FormLabel>{language === 'pt' ? 'Aprendizado Chave' : 'Key Learning'}</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={language === 'pt' 
                  ? "O que o leitor deve aprender com este artigo..." 
                  : "What the reader should learn from this article..."} 
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
