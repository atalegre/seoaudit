
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { websiteFormSchema, WebsiteFormValues } from './websiteFormSchema';
import { useAddWebsite } from '@/hooks/useAddWebsite';

interface WebsiteFormProps {
  onSuccess?: () => void;
  userId?: string;
}

const WebsiteForm = ({ onSuccess, userId }: WebsiteFormProps) => {
  const { addWebsite, isSubmitting } = useAddWebsite({ onSuccess, userId });
  
  const form = useForm<WebsiteFormValues>({
    resolver: zodResolver(websiteFormSchema),
    defaultValues: {
      website: '',
      name: '',
    },
  });

  const onSubmit = async (values: WebsiteFormValues) => {
    const success = await addWebsite(values);
    if (success) {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Website</FormLabel>
              <FormControl>
                <Input placeholder="Meu Website" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL do Website</FormLabel>
              <FormControl>
                <Input placeholder="https://meuwebsite.pt" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "A processar..." : "Adicionar e Analisar Website"}
        </Button>
      </form>
    </Form>
  );
};

export default WebsiteForm;
