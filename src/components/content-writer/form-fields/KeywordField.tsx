
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

// Import the schema type from the parent form
import { formSchema } from '../ContentWriterForm';

type FormValues = z.infer<typeof formSchema>;

interface KeywordFieldProps {
  form: UseFormReturn<FormValues>;
}

const KeywordField: React.FC<KeywordFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="keyword"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Palavra-chave principal</FormLabel>
          <FormControl>
            <Input placeholder="Ex: marketing digital" {...field} />
          </FormControl>
          <FormDescription>
            Esta será a palavra-chave principal do seu conteúdo
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default KeywordField;
