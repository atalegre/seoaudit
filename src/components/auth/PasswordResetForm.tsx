
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import EmailField from './EmailField';
import { Mail } from 'lucide-react';

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email é obrigatório' })
    .email({ message: 'Email inválido' }),
});

type PasswordResetFormProps = {
  setAuthError: (error: string | null) => void;
};

const PasswordResetForm = ({ setAuthError }: PasswordResetFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setAuthError(null);
    
    try {
      // Request password reset email from Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error("Password reset error:", error);
        setAuthError(error.message);
        toast({
          variant: "destructive",
          title: "Erro ao enviar email",
          description: error.message,
        });
      } else {
        // Success - email sent
        setEmailSent(true);
        toast({
          title: "Email enviado",
          description: "Verifique seu email para redefinir sua password.",
        });
      }
    } catch (error: any) {
      console.error("Exception during password reset:", error);
      setAuthError(error.message);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (emailSent) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto bg-muted/30 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-medium">Email enviado</h3>
        <p className="text-muted-foreground">
          Enviamos instruções para redefinir sua password para o endereço de email fornecido.
        </p>
        <Button 
          variant="outline"
          className="mt-2"
          onClick={() => form.reset()}
        >
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <EmailField form={form} />
        
        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>Enviando...</>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" /> Enviar email de recuperação
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PasswordResetForm;
