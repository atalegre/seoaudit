
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
