
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { BlogFormValues, blogCategories } from './types';
import { useLanguage } from '@/contexts/LanguageContext';

interface BlogFormCategoriesProps {
  form: UseFormReturn<BlogFormValues>;
}

const BlogFormCategories: React.FC<BlogFormCategoriesProps> = ({ form }) => {
  const { language } = useLanguage();
  
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{language === 'pt' ? 'Categoria' : 'Category'}</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'pt' ? "Selecione uma categoria" : "Select a category"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {blogCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {language === 'pt' ? category.label.pt : category.label.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{language === 'pt' ? 'Tags' : 'Tags'}</FormLabel>
            <FormControl>
              <Input 
                placeholder={language === 'pt' 
                  ? "seo, google, otimização (separadas por vírgula)" 
                  : "seo, google, optimization (comma-separated)"} 
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

export default BlogFormCategories;
