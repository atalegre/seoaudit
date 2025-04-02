
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import EmailField from './EmailField';
import PasswordField from './PasswordField';
import { checkUserRole } from '@/utils/auth/authService';

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email é obrigatório' })
    .email({ message: 'Email inválido' }),
  password: z
    .string()
    .min(6, { message: 'Password deve ter pelo menos 6 caracteres' }),
});

type SignInFormProps = {
  email?: string;
  returnTo?: string;
  setAuthError: (error: string | null) => void;
};

const SignInForm = ({ email, returnTo, setAuthError }: SignInFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email || '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoggingIn(true);
    setAuthError(null);
    
    try {
      console.log("Login attempt with:", values.email);
      // Try to log in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error("Login error:", error);
        setAuthError(error.message);
        
        // Special handling for unconfirmed email
        if (error.message.includes("Email not confirmed")) {
          localStorage.setItem('pendingVerificationEmail', values.email);
          toast({
            variant: "destructive",
            title: "Email não confirmado",
            description: "Por favor verifique o seu email para confirmar a conta.",
          });
          navigate('/verification', { state: { email: values.email } });
          return;
        }
        
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: error.message,
        });
      } else {
        // Successfully logged in
        console.log("Login successful:", data);
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo de volta!",
        });
        
        // Check user role and redirect accordingly
        if (data.user) {
          const userRole = await checkUserRole(data.user.id);
          
          if (userRole === 'admin') {
            navigate('/dashboard'); // Admin dashboard
          } else {
            navigate('/dashboard/client'); // Client dashboard
          }
        } else {
          navigate('/dashboard/client'); // Default redirect
        }
      }
    } catch (error: any) {
      console.error("Exception during login:", error);
      setAuthError(error.message);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      });
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <EmailField form={form} />
        <PasswordField form={form} name="password" />
        <div className="text-sm text-muted-foreground">
          <p>Para entrar como admin, use:</p>
          <p>Email: seoadmin@exemplo.com</p>
          <p>Password: admin123</p>
          <p className="mt-2">Para entrar como cliente, use:</p>
          <p>Email: seoclient@exemplo.com</p>
          <p>Password: client123</p>
        </div>
        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <>Entrando...</>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" /> Entrar
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;
