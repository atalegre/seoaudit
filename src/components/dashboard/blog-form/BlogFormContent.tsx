
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
  
  // Let's log what values we have in the form
  const contentValue = form.watch('content');
  const keyLearningValue = form.watch('keyLearning');
  
  console.log('Content form values:', { 
    content: contentValue,
    keyLearning: keyLearningValue
  });
  
  return (
    <>
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{language === 'pt' ? 'Conteúdo' : 'Content'}</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={language === 'pt' ? 'Escreva o conteúdo do post aqui...' : 'Write post content here...'} 
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
            <FormLabel>{language === 'pt' ? 'Aprendizados Principais' : 'Key Learning'}</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={language === 'pt' ? 'Destaque os principais pontos de aprendizado...' : 'Highlight key learning points...'} 
                {...field}
                className="min-h-[100px]"
                onChange={(e) => {
                  console.log('keyLearning value changed:', e.target.value);
                  field.onChange(e);
                }}
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
