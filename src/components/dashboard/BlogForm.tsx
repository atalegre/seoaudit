import React, { useState, useCallback } from 'react';
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
import { UploadCloud, X, Image } from 'lucide-react';
import { BlogPost } from '@/types/blog';

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
  imageSrc: z.string().optional(),
});

type BlogFormValues = z.infer<typeof blogPostSchema>;

interface BlogFormProps {
  initialData?: BlogPost;
  onSuccess?: () => void;
}

const BlogForm: React.FC<BlogFormProps> = ({ initialData, onSuccess }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isEditing = !!initialData;

  // Transform the tags array into a comma-separated string if we're editing
  const defaultValues = initialData ? {
    ...initialData,
    tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags
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

  // Set image preview if we're editing and have an image
  React.useEffect(() => {
    if (initialData?.imageSrc) {
      setImagePreview(initialData.imageSrc);
    }
  }, [initialData]);

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

  // Handle file drop and upload
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive"
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 5MB.",
        variant: "destructive"
      });
      return;
    }

    setImageFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const clearSelectedImage = () => {
    setImageFile(null);
    setImagePreview(null);
    form.setValue('imageSrc', '');
  };

  const uploadImageToStorage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `blog-images/${fileName}`;
      
      // Upload the file
      const { error: uploadError, data } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);
        
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const onSubmit = async (data: BlogFormValues) => {
    setIsSubmitting(true);
    try {
      let imageSrc = data.imageSrc;
      
      // If we have a new image file, upload it
      if (imageFile) {
        imageSrc = await uploadImageToStorage(imageFile);
      }
      
      // Convert tags from comma-separated string to array
      const tagsArray = data.tags.split(',').map(tag => tag.trim());
      
      // Prepare data for submission
      const blogPostData: BlogPost = {
        ...data,
        imageSrc,
        tags: tagsArray,
        popularity: initialData?.popularity || Math.floor(Math.random() * 25) + 75, // Default popularity between 75-100 if new
        date: initialData?.date || new Date().toISOString().split('T')[0], // Use current date if new
      };

      // Save to Supabase
      let result;
      if (isEditing && initialData?.id) {
        // Update existing post
        result = await supabase
          .from('blog_posts')
          .update(blogPostData)
          .eq('id', initialData.id);
      } else {
        // Create new post
        result = await supabase
          .from('blog_posts')
          .insert([blogPostData] as any);
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
            
            {/* Image Upload Area */}
            <FormItem>
              <FormLabel>Imagem de Capa</FormLabel>
              <div
                className={`mt-1 p-6 border-2 border-dashed rounded-md transition-colors ${
                  isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-md" 
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 rounded-full"
                      type="button"
                      onClick={clearSelectedImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <UploadCloud className="h-12 w-12 text-gray-400" />
                    <div className="text-sm text-center">
                      <label htmlFor="file-upload" className="cursor-pointer text-primary hover:text-primary/80">
                        <span>Carregar um arquivo</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                      <span className="text-gray-500"> ou arraste e solte</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF até 5MB
                    </p>
                  </div>
                )}
              </div>
              <FormMessage />
              
              {/* Hidden input for image URL */}
              <input 
                type="hidden" 
                {...form.register('imageSrc')} 
                value={imagePreview || form.getValues('imageSrc') || ''} 
              />
            </FormItem>
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
