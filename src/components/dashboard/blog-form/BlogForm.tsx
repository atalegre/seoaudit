
import React from 'react';
import { Form } from '@/components/ui/form';
import { BlogPost } from '@/types/blog';
import BlogFormMetadata from './BlogFormMetadata';
import BlogFormCategories from './BlogFormCategories';
import BlogFormImageUpload from './BlogFormImageUpload';
import BlogFormContent from './BlogFormContent';
import BlogFormActions from './BlogFormActions';
import { useBlogForm } from './useBlogForm';
import { useLanguage } from '@/contexts/LanguageContext';

interface BlogFormProps {
  initialData?: BlogPost | null;
  onSuccess?: () => void;
}

const BlogForm: React.FC<BlogFormProps> = ({ initialData = null, onSuccess }) => {
  const { language } = useLanguage();
  const {
    form,
    isSubmitting,
    imageFile,
    setImageFile,
    imagePreview,
    setImagePreview,
    isEditing,
    onSubmit
  } = useBlogForm(initialData, onSuccess);
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <BlogFormMetadata form={form} />
            <BlogFormImageUpload 
              form={form} 
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
              setImageFile={setImageFile}
            />
          </div>
          <div>
            <BlogFormCategories form={form} />
          </div>
        </div>

        <BlogFormContent form={form} />

        <BlogFormActions
          isSubmitting={isSubmitting}
          isEditing={isEditing}
          onCancel={() => onSuccess?.()}
        />
      </form>
    </Form>
  );
};

export default BlogForm;
