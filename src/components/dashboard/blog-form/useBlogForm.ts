
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { BlogPost } from '@/types/blog';
import { BlogFormValues, blogPostSchema, getEnglishValidationMessages } from './types';
import { uploadBlogImage, createBlogPost, updateBlogPost } from '@/utils/supabaseBlogClient';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export const useBlogForm = (initialData: BlogPost | null = null, onSuccess?: () => void) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageSrc || null);
  const { language } = useLanguage();
  
  const isEditing = !!initialData;
  
  // Prepare default values from initial data or empty values
  const defaultValues: Partial<BlogFormValues> = {
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    keyLearning: initialData?.keyLearning || '',
    category: initialData?.category || '',
    tags: Array.isArray(initialData?.tags) 
      ? initialData?.tags.join(', ') 
      : initialData?.tags || '',
    imageSrc: initialData?.imageSrc || '',
  };

  // Get the correct error messages based on language
  const getErrorMessage = (field: keyof BlogFormValues, error: string) => {
    if (language === 'en') {
      const englishMessages = getEnglishValidationMessages();
      return englishMessages[field] || error;
    }
    return error;
  };

  // Initialize the form
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues,
  });

  // Handle form submission
  const onSubmit = async (data: BlogFormValues) => {
    try {
      setIsSubmitting(true);
      let imageSrc = data.imageSrc;
      
      // Upload image if a new one is selected
      if (imageFile) {
        imageSrc = await uploadBlogImage(imageFile);
      }
      
      // Prepare post data with required properties explicitly defined
      const postData: BlogPost = {
        title: data.title, // explicitly define required properties
        slug: data.slug,   // explicitly define required properties
        excerpt: data.excerpt,
        content: data.content,
        keyLearning: data.keyLearning,
        category: data.category,
        tags: data.tags.split(',').map(tag => tag.trim()),
        imageSrc,
        id: initialData?.id || '',
        date: initialData?.date || new Date().toISOString(),
        popularity: initialData?.popularity || 0,
      };
      
      // Create or update post
      if (isEditing && initialData?.id) {
        await updateBlogPost(initialData.id, postData);
        toast.success(language === 'pt' ? 'Post atualizado com sucesso!' : 'Post updated successfully!');
      } else {
        await createBlogPost(postData);
        toast.success(language === 'pt' ? 'Post criado com sucesso!' : 'Post created successfully!');
      }
      
      // Clear form and navigate
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/dashboard/blog-posts');
      }
    } catch (error) {
      console.error('Error submitting blog post:', error);
      toast.error(language === 'pt' 
        ? 'Erro ao salvar o post. Tente novamente.' 
        : 'Error saving post. Please try again.');
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
