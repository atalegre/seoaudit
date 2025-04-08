
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Sparkles } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Definir o schema de validação
const formSchema = z.object({
  keyword: z.string().min(2, { message: 'Palavra-chave é obrigatória' }),
  language: z.string().min(1, { message: 'Selecione um idioma' }),
  tone: z.string().min(1, { message: 'Selecione um tom de voz' }),
  contentType: z.string().min(1, { message: 'Selecione um tipo de conteúdo' }),
  size: z.string().min(1, { message: 'Selecione um tamanho' }),
});

type FormValues = z.infer<typeof formSchema>;

interface ContentWriterFormProps {
  onSubmit: (data: FormValues) => void;
}

const ContentWriterForm: React.FC<ContentWriterFormProps> = ({ onSubmit }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyword: '',
      language: 'PT',
      tone: 'Profissional',
      contentType: 'Post de blog',
      size: 'Médio',
    },
  });

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Gerador de Conteúdo</CardTitle>
        <CardDescription>
          Preencha os campos abaixo para gerar conteúdo otimizado para SEO
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Palavra-chave principal */}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Idioma */}
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

              {/* Tom de voz */}
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
                        <SelectItem value="Profissional">Profissional</SelectItem>
                        <SelectItem value="Casual">Casual</SelectItem>
                        <SelectItem value="Técnico">Técnico</SelectItem>
                        <SelectItem value="Criativo">Criativo</SelectItem>
                        <SelectItem value="Educativo">Educativo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tipo de conteúdo */}
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

              {/* Tamanho aproximado */}
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
            </div>

            <Button type="submit" className="w-full">
              <Sparkles className="h-4 w-4 mr-2" />
              Gerar conteúdo com IA
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContentWriterForm;
