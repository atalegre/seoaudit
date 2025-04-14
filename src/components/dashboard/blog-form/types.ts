
import { z } from 'zod';

// Schema for blog post form
export const blogPostSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  slug: z.string().min(5, { message: 'Slug must be at least 5 characters' }),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  keyLearning: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  imageSrc: z.string().optional(),
});

// Type for form values
export type BlogFormValues = z.infer<typeof blogPostSchema>;

// Error messages for English locale
export const getEnglishValidationMessages = () => ({
  title: 'Title must be at least 5 characters',
  slug: 'Slug must be at least 5 characters',
  content: 'Content is required',
  excerpt: 'Excerpt is required',
  keyLearning: 'Key learning points are required',
  category: 'Category is required',
  tags: 'At least one tag is required',
  imageSrc: 'Image is required',
});

// Blog post categories that match those in the database
export const blogCategories = [
  'SEO',
  'Technical SEO',
  'Content Strategy',
  'Local SEO',
  'Mobile SEO',
  'AI Optimization',
  'E-commerce SEO',
  'Analytics',
  'Link Building',
];
