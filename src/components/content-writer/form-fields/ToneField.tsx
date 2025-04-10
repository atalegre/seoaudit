
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

// Import the schema type from the parent form
import { formSchema } from '../ContentWriterForm';

type FormValues = z.infer<typeof formSchema>;

interface ToneFieldProps {
  form: UseFormReturn<FormValues>;
}

const ToneField: React.FC<ToneFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="tone"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tom de voz</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tom" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="Profissional">👨‍💼 Profissional</SelectItem>
              <SelectItem value="Casual">😄 Casual</SelectItem>
              <SelectItem value="Técnico">🤓 Técnico</SelectItem>
              <SelectItem value="Convincente">🎯 Convincente</SelectItem>
              <SelectItem value="Educativo">📚 Educativo</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ToneField;
