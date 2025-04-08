
import * as z from 'zod';

export const userFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'O nome deve ter pelo menos 2 caracteres' })
    .max(100, { message: 'O nome não pode exceder 100 caracteres' }),
  email: z
    .string()
    .email({ message: 'Email inválido' })
    .min(5, { message: 'O email deve ter pelo menos 5 caracteres' })
    .max(100, { message: 'O email não pode exceder 100 caracteres' }),
  role: z.enum(['admin', 'editor', 'user'], {
    required_error: 'Por favor selecione uma função',
  }),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
