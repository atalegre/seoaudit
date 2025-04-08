
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

// Import the schema type from the parent form
import { formSchema } from '../ContentWriterForm';

type FormValues = z.infer<typeof formSchema>;

interface ContentTypeFieldProps {
  form: UseFormReturn<FormValues>;
}

const ContentTypeField: React.FC<ContentTypeFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="contentType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo de conteúdo</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tipo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="Post de blog">Post de blog</SelectItem>
              <SelectItem value="Meta descrição">Meta descrição</SelectItem>
              <SelectItem value="Título de artigo">Título de artigo</SelectItem>
              <SelectItem value="FAQ">FAQ</SelectItem>
              <SelectItem value="Anúncio Google">Anúncio Google</SelectItem>
              <SelectItem value="Introdução de produto">Introdução de produto</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ContentTypeField;
