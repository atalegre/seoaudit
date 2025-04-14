
import { z } from 'zod';

export const blogPostSchema = z.object({
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

export type BlogFormValues = z.infer<typeof blogPostSchema>;

// Define the blog categories to ensure consistency across the application
export const blogCategories = [
  { value: 'seo', label: { pt: 'SEO', en: 'SEO' } },
  { value: 'aio', label: { pt: 'Otimização para IA', en: 'AI Optimization' } },
  { value: 'technical-seo', label: { pt: 'SEO Técnico', en: 'Technical SEO' } },
  { value: 'content', label: { pt: 'Conteúdo', en: 'Content' } },
  { value: 'analytics', label: { pt: 'Analytics', en: 'Analytics' } },
  { value: 'updates', label: { pt: 'Atualizações', en: 'Updates' } },
];

// Validation messages in English
export const getEnglishValidationMessages = () => ({
  title: "Title must be at least 5 characters",
  slug: "Slug must be at least 3 characters and contain only lowercase letters, numbers, and hyphens",
  excerpt: "Excerpt must be at least 10 characters",
  content: "Content must be at least 50 characters",
  keyLearning: "Key learning must be at least 10 characters",
  category: "Select a category",
  tags: "Add at least one tag",
});
