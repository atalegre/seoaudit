
import { z } from 'zod';

export const websiteFormSchema = z.object({
  website: z.string().url({ message: "Por favor introduza um URL válido" }),
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
});

export type WebsiteFormValues = z.infer<typeof websiteFormSchema>;
