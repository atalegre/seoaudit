
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { getFullAnalysis } from '@/utils/api';
import { saveClientsToDatabase } from '@/utils/api/clientService';

const formSchema = z.object({
  website: z.string().url({ message: "Por favor introduza um URL válido" }),
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddWebsiteFormProps {
  onSuccess?: () => void;
  userId?: string;
}

const AddWebsiteForm = ({ onSuccess, userId }: AddWebsiteFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      website: '',
      name: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Normalize URL
      let url = values.website;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      toast.info("A iniciar análise...", {
        description: "Este processo pode demorar alguns segundos."
      });
      
      // Perform the analysis
      const analysis = await getFullAnalysis(url);
      
      // Create a new client object with the analysis results
      const newClient = {
        id: Date.now(), // Simple ID generation for now
        name: values.name,
        website: url,
        contactName: '',
        contactEmail: '',
        notes: '',
        status: analysis.overallStatus || 'pending',
        account: userId || 'Admin',
        seoScore: analysis.seo.score || 0,
        aioScore: analysis.aio.score || 0,
        lastAnalysis: new Date().toISOString(),
        lastReport: ''
      };
      
      // Save the new client to the database
      await saveClientsToDatabase([newClient]);
      
      toast.success("Website adicionado com sucesso", {
        description: "A análise foi concluída e o website foi adicionado."
      });
      
      // Reset form
      form.reset();
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error adding website:", error);
      toast.error("Erro ao adicionar website", {
        description: "Ocorreu um erro ao analisar o website. Por favor tente novamente."
      });
    } finally {
      setIsSubmitting(false);
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

export default AddWebsiteForm;
