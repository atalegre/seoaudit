
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

// Import the schema type from the parent form
import { formSchema } from '../ContentWriterForm';

type FormValues = z.infer<typeof formSchema>;

interface LanguageFieldProps {
  form: UseFormReturn<FormValues>;
}

const LanguageField: React.FC<LanguageFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="language"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Idioma</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um idioma" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="PT">Português</SelectItem>
              <SelectItem value="EN">Inglês</SelectItem>
              <SelectItem value="ES">Espanhol</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LanguageField;
