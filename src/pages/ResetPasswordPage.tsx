
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Key, Loader2 } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthCard from '@/components/auth/AuthCard';
import AuthError from '@/components/auth/AuthError';
import { updatePassword } from '@/utils/auth/passwordService';

const formSchema = z.object({
  password: z
    .string()
    .min(8, { message: 'Password deve ter pelo menos 8 caracteres' })
    .regex(/[A-Z]/, { message: 'Password deve conter pelo menos uma letra maiúscula' })
    .regex(/[0-9]/, { message: 'Password deve conter pelo menos um número' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password deve conter pelo menos um caractere especial' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As passwords não coincidem",
  path: ["confirmPassword"],
});

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

  useEffect(() => {
    // Check if we have a hash parameter in the URL
    // If not, the user might have accessed this page directly
    // and we should redirect them
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const type = urlParams.get('type');
    
    if ((!hash || !hash.includes('type=recovery')) && (!type || type !== 'recovery')) {
      setAuthError('Link de recuperação inválido ou expirado.');
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setAuthError(null);
    
    try {
      const result = await updatePassword(values.password);

      if (result.success) {
        setResetComplete(true);
        toast({
          title: "Password redefinida",
          description: "Sua password foi atualizada com sucesso.",
        });

        // Redirect to sign in page after a short delay
        setTimeout(() => {
          navigate('/signin');
        }, 3000);
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

  if (resetComplete) {
    return (
      <AuthLayout>
        <AuthCard 
          title="Password Redefinida"
          description="Sua password foi alterada com sucesso"
          footer={null}
        >
          <div className="text-center space-y-4">
            <div className="mx-auto bg-muted/30 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Key className="h-8 w-8 text-primary" />
            </div>
            <p className="text-muted-foreground">
              Você será redirecionado para a página de login em instantes...
            </p>
            <Button 
              className="mt-2"
              onClick={() => navigate('/signin')}
            >
              Ir para o login
            </Button>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard 
        title="Redefinir Password"
        description="Crie uma nova password para sua conta"
        footer={null}
      >
        <AuthError error={authError} />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="********"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="********"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
            
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isSubmitting || !!authError}
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Redefinindo...</>
              ) : (
                <>
                  <Key className="mr-2 h-4 w-4" /> Redefinir Password
                </>
              )}
            </Button>
          </form>
        </Form>
      </AuthCard>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
