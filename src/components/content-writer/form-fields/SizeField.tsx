
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

// Import the schema type from the parent form
import { formSchema } from '../ContentWriterForm';

type FormValues = z.infer<typeof formSchema>;

interface SizeFieldProps {
  form: UseFormReturn<FormValues>;
}

const SizeField: React.FC<SizeFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="size"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tamanho aproximado</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tamanho" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="Curto">Curto</SelectItem>
              <SelectItem value="Médio">Médio</SelectItem>
              <SelectItem value="Longo">Longo</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SizeField;
