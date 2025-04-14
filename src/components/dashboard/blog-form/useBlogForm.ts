
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
      : '',
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
      console.log('Submitting blog post with data:', data);
      let imageSrc = data.imageSrc;
      
      // Upload image if a new one is selected
      if (imageFile) {
        console.log('Uploading image file:', imageFile.name);
        try {
          imageSrc = await uploadBlogImage(imageFile);
          console.log('Image uploaded successfully:', imageSrc);
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          toast.error(language === 'pt' 
            ? 'Erro ao fazer upload da imagem. Por favor, tente novamente.' 
            : 'Error uploading image. Please try again.');
          setIsSubmitting(false);
          return;
        }
      } else if (imagePreview && imagePreview.startsWith('data:')) {
        // If imagePreview is a data URL (from paste or drag-and-drop) but no file is set
        console.error('Image preview is a data URL but no file is set. This should not happen.');
        toast.error(language === 'pt' 
          ? 'Formato de imagem inválido. Por favor, tente novamente.' 
          : 'Invalid image format. Please try again.');
        setIsSubmitting(false);
        return;
      }
      
      // Prepare post data with required properties explicitly defined
      // Ensure tags is always an array
      const postData: BlogPost = {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        keyLearning: data.keyLearning,
        category: data.category,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
        imageSrc,
        id: initialData?.id || '',
        date: initialData?.date || new Date().toISOString(),
        popularity: initialData?.popularity || 0,
      };
      
      console.log('Prepared post data:', postData);
      
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
