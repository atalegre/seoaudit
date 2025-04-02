
import * as z from 'zod';

export const signupFormSchema = z.object({
  name: z.string().min(2, { message: 'Nome é obrigatório' }),
  email: z
    .string()
    .min(1, { message: 'Email é obrigatório' })
    .email({ message: 'Email inválido' }),
  password: z
    .string()
    .min(8, { message: 'Password deve ter pelo menos 8 caracteres' })
    .regex(/[A-Z]/, { message: 'Password deve conter pelo menos uma letra maiúscula' })
    .regex(/[0-9]/, { message: 'Password deve conter pelo menos um número' }),
  acceptTerms: z.boolean().refine(val => val, {
    message: 'Deve aceitar os termos e condições',
  }),
});

export type SignUpFormValues = z.infer<typeof signupFormSchema>;
