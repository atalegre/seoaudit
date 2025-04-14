
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
    <div className="space-y-6">
      {/* Portuguese Content */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Conteúdo em Português</h3>
        <FormField
          control={form.control}
          name="content.pt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdo</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Escreva o conteúdo do post aqui..." 
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
          name="keyLearning.pt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aprendizados Principais</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Destaque os principais pontos de aprendizado..." 
                  {...field}
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* English Content */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">English Content</h3>
        <FormField
          control={form.control}
          name="content.en"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Write post content here..." 
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
          name="keyLearning.en"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key Learning</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Highlight key learning points..." 
                  {...field}
                  className="min-h-[100px]"
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

export default BlogFormContent;
