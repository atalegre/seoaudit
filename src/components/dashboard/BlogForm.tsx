
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { categories } from '@/data/blog-data';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Define the schema for our form validation
const blogPostSchema = z.object({
  title: z.string().min(5, { message: "O título deve ter pelo menos 5 caracteres" }),
  slug: z.string().min(3, { message: "O slug deve ter pelo menos 3 caracteres" }).regex(/^[a-z0-9-]+$/, {
    message: "O slug deve conter apenas letras minúsculas, números e hífens"
  }),
  excerpt: z.string().min(10, { message: "O resumo deve ter pelo menos 10 caracteres" }),
  content: z.string().min(50, { message: "O conteúdo deve ter pelo menos 50 caracteres" }),
  keyLearning: z.string().min(10, { message: "O aprendizado chave deve ter pelo menos 10 caracteres" }),
  category: z.string().min(1, { message: "Selecione uma categoria" }),
  tags: z.string().min(1, { message: "Adicione pelo menos uma tag" }),
  imageSrc: z.string().url({ message: "A URL da imagem deve ser válida" }),
});

type BlogFormValues = z.infer<typeof blogPostSchema>;

interface BlogFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

const BlogForm: React.FC<BlogFormProps> = ({ initialData, onSuccess }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData;

  // Transform the tags array into a comma-separated string if we're editing
  const defaultValues = initialData ? {
    ...initialData,
    tags: initialData.tags.join(', ')
  } : {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    keyLearning: '',
    category: '',
    tags: '',
    imageSrc: '',
  };

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues
  });

  // Generate a slug from the title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  // Handle title change to auto-generate slug
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'title' && !isEditing) {
        const title = value.title as string;
        if (title) {
          form.setValue('slug', generateSlug(title));
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, isEditing]);

  const onSubmit = async (data: BlogFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert tags from comma-separated string to array
      const tagsArray = data.tags.split(',').map(tag => tag.trim());
      
      // Prepare data for submission
      const blogPostData = {
        ...data,
        tags: tagsArray,
        popularity: initialData?.popularity || Math.floor(Math.random() * 25) + 75, // Default popularity between 75-100 if new
        date: initialData?.date || new Date().toISOString().split('T')[0], // Use current date if new
      };

      // Save to Supabase
      let result;
      if (isEditing) {
        // Update existing post
        // Use type assertion to bypass TypeScript check since we know the structure is correct
        result = await (supabase
          .from('blog_posts' as any)
          .update(blogPostData as any)
          .eq('id', initialData.id) as any);
      } else {
        // Create new post
        // Use type assertion to bypass TypeScript check since we know the structure is correct
        result = await (supabase
          .from('blog_posts' as any)
          .insert([blogPostData] as any) as any);
      }

      if (result.error) throw result.error;
      
      toast({
        title: isEditing ? "Post atualizado" : "Post criado",
        description: isEditing 
          ? "O post foi atualizado com sucesso." 
          : "O post foi criado com sucesso.",
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving blog post:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o post. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título do post" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="slug-do-post" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resumo</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Breve resumo do conteúdo" 
                      {...field}
                      className="min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageSrc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Imagem</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
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
                  <FormLabel>Tags (separadas por vírgula)</FormLabel>
                  <FormControl>
                    <Input placeholder="SEO, AIO, Conteúdo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keyLearning"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aprendizado Chave</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Pontos principais que o leitor deve aprender" 
                      {...field}
                      className="min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdo (HTML)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="<h2>Introdução</h2><p>Conteúdo do artigo...</p>" 
                  {...field}
                  className="min-h-[300px] font-mono"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onSuccess?.()}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 
              "Salvando..." : 
              isEditing ? "Atualizar Post" : "Criar Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BlogForm;
