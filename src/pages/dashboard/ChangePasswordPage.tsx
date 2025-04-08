
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updatePassword } from '@/utils/auth/passwordService';
import { toast } from 'sonner';
import { Key, Loader } from 'lucide-react';
import PasswordField from '@/components/auth/PasswordField';

const formSchema = z.object({
  currentPassword: z.string().min(1, "A senha atual é obrigatória"),
  newPassword: z
    .string()
    .min(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
    .regex(/[A-Z]/, { message: 'Senha deve conter pelo menos uma letra maiúscula' })
    .regex(/[0-9]/, { message: 'Senha deve conter pelo menos um número' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Senha deve conter pelo menos um caractere especial' }),
  confirmNewPassword: z.string().min(1, "A confirmação da senha é obrigatória"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "As senhas não coincidem",
  path: ["confirmNewPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const ChangePasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await updatePassword(values.newPassword, values.currentPassword);
      
      toast.success("Senha alterada com sucesso");
      
      // Reset the form
      form.reset({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error: any) {
      console.error("Erro ao alterar senha:", error);
      let errorMessage = "Ocorreu um erro ao alterar sua senha.";
      
      if (error.message) {
        if (error.message.includes("incorrect") || error.message.includes("invalid")) {
          errorMessage = "Senha atual incorreta. Por favor, verifique e tente novamente.";
        } else if (error.message.includes("weak password")) {
          errorMessage = "A nova senha é muito fraca. Escolha uma senha mais forte.";
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <h1 className="text-3xl font-bold tracking-tight mb-4">Alterar Senha</h1>
      <p className="text-muted-foreground mb-6">
        Atualize sua senha para manter sua conta segura
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle>Alterar Senha</CardTitle>
          <CardDescription>
            Sua senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, 
            números e caracteres especiais.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <PasswordField
                form={form}
                name="currentPassword"
                label="Senha Atual"
              />
              
              <PasswordField
                form={form}
                name="newPassword"
                label="Nova Senha"
              />
              
              <PasswordField
                form={form}
                name="confirmNewPassword"
                label="Confirmar Nova Senha"
              />
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p>A senha deve conter:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>Pelo menos 8 caracteres</li>
                  <li>Pelo menos uma letra maiúscula</li>
                  <li>Pelo menos um número</li>
                  <li>Pelo menos um caractere especial</li>
                </ul>
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Alterando senha...
                  </>
                ) : (
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Alterar Senha
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePasswordPage;
