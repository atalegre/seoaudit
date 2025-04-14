
import { z } from 'zod';

// Schema for multilingual blog post form
export const blogPostSchema = z.object({
  title: z.object({
    pt: z.string().min(5, { message: 'Título deve ter pelo menos 5 caracteres' }),
    en: z.string().min(5, { message: 'Title must be at least 5 characters' })
  }),
  slug: z.string().min(5, { message: 'Slug must be at least 5 characters' }),
  excerpt: z.object({
    pt: z.string().optional(),
    en: z.string().optional()
  }),
  content: z.object({
    pt: z.string().optional(),
    en: z.string().optional()
  }),
  keyLearning: z.object({
    pt: z.string().optional(),
    en: z.string().optional()
  }),
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

// Define proper category type with value and label
export type BlogCategory = {
  value: string;
  label: {
    en: string;
    pt: string;
  };
};

// Blog post categories that match those in the database
export const blogCategories: BlogCategory[] = [
  {
    value: 'SEO',
    label: { en: 'SEO', pt: 'SEO' }
  },
  {
    value: 'Technical SEO',
    label: { en: 'Technical SEO', pt: 'SEO Técnico' }
  },
  {
    value: 'Content Strategy',
    label: { en: 'Content Strategy', pt: 'Estratégia de Conteúdo' }
  },
  {
    value: 'Local SEO',
    label: { en: 'Local SEO', pt: 'SEO Local' }
  },
  {
    value: 'Mobile SEO',
    label: { en: 'Mobile SEO', pt: 'SEO Mobile' }
  },
  {
    value: 'AI Optimization',
    label: { en: 'AI Optimization', pt: 'Otimização com IA' }
  },
  {
    value: 'E-commerce SEO',
    label: { en: 'E-commerce SEO', pt: 'SEO para E-commerce' }
  },
  {
    value: 'Analytics',
    label: { en: 'Analytics', pt: 'Analytics' }
  },
  {
    value: 'Link Building',
    label: { en: 'Link Building', pt: 'Construção de Links' }
  },
];
