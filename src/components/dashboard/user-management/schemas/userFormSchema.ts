
import { z } from 'zod';

// Form schema for user creation/editing
export const userFormSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  role: z.enum(['admin', 'editor', 'user'], {
    required_error: 'Por favor, selecione uma função',
  }),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
