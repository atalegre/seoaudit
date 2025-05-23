
import * as z from 'zod';

export const signinFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email é obrigatório' })
    .email({ message: 'Email inválido' }),
  password: z
    .string()
    .min(6, { message: 'Password deve ter pelo menos 6 caracteres' }),
});

export type SigninFormValues = z.infer<typeof signinFormSchema>;
