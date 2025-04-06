
import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { BlogPost } from '@/types/blog';
import { createBlogPost, updateBlogPost, uploadBlogImage } from '@/utils/supabaseBlogClient';
import { blogPostSchema, BlogFormValues } from './types';

export const useBlogForm = (initialData: BlogPost | null, onSuccess?: () => void) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const isEditing = !!initialData;

  const defaultValues = initialData 
    ? {
        ...initialData,
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags
      } 
    : {
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

  useEffect(() => {
    if (initialData?.imageSrc) {
      setImagePreview(initialData.imageSrc);
    }
  }, [initialData]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  useEffect(() => {
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
      let imageSrc = data.imageSrc;
      
      if (imageFile) {
        imageSrc = await uploadBlogImage(imageFile);
      }
      
      const tagsArray = data.tags.split(',').map(tag => tag.trim());
      
      const blogPostData: BlogPost = {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        keyLearning: data.keyLearning,
        category: data.category,
        imageSrc,
        tags: tagsArray,
        popularity: initialData?.popularity || Math.floor(Math.random() * 25) + 75,
        date: initialData?.date || new Date().toISOString().split('T')[0],
      };

      if (isEditing && initialData?.id) {
        await updateBlogPost(initialData.id, blogPostData);
      } else {
        await createBlogPost(blogPostData);
      }
      
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

  return {
    form,
    isSubmitting,
    imageFile,
    setImageFile,
    imagePreview,
    setImagePreview,
    isEditing,
    onSubmit
  };
};
