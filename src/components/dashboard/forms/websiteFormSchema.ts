
import { z } from 'zod';

export const websiteFormSchema = z.object({
  website: z.string()
    .min(1, { message: "URL é obrigatório" })
    .refine((val) => {
      // Check if the URL looks valid even without protocol prefix
      const pattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
      return pattern.test(val);
    }, { message: "Por favor introduza um URL válido" }),
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
});

export type WebsiteFormValues = z.infer<typeof websiteFormSchema>;
