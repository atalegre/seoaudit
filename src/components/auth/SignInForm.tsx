
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
import { signInWithEmail, checkUserRole } from '@/utils/auth/authService';

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
      
      // Use the signInWithEmail service function instead of direct Supabase call
      try {
        const { data, error } = await signInWithEmail(values.email, values.password);

        if (error) {
          console.error("Login error:", error);
          setAuthError(error.message);
          
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
            description: "Email ou password incorretos. Tente as credenciais de demonstração listadas abaixo.",
          });
        } else {
          console.log("Login successful:", data);
          toast({
            title: "Login bem-sucedido",
            description: "Bem-vindo de volta!",
          });
          
          if (data.user) {
            const userRole = await checkUserRole(data.user.id);
            console.log("User role:", userRole);
            
            if (userRole === 'admin') {
              navigate('/dashboard');
            } else {
              navigate('/dashboard/client');
            }
          } else {
            navigate('/dashboard/client');
          }
        }
      } catch (error: any) {
        console.error("Exception during login:", error);
        
        // Special handling for admin account
        if (values.email === 'atalegre@me.com' && values.password === 'admin123') {
          toast({
            variant: "destructive",
            title: "Erro ao fazer login como admin",
            description: "Tentando resolver o problema...",
          });
          
          // Try to log in with a different approach - create user first
          try {
            console.log("Trying special admin creation flow");
            
            // Sign up the admin user
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: 'atalegre@me.com',
              password: 'admin123',
              options: {
                data: {
                  full_name: 'SEO Admin',
                  role: 'admin',
                }
              }
            });
            
            if (signUpError && !signUpError.message.includes("already registered")) {
              throw signUpError;
            }
            
            // Try signing in again
            const { data, error } = await supabase.auth.signInWithPassword({
              email: 'atalegre@me.com',
              password: 'admin123',
            });
            
            if (error) {
              throw error;
            }
            
            // Set up admin in users table if login succeeded
            if (data.user) {
              await supabase.from('users').upsert(
                {
                  id: data.user.id,
                  name: 'SEO Admin',
                  email: 'atalegre@me.com',
                  role: 'admin'
                },
                { onConflict: 'id' }
              );
              
              toast({
                title: "Login bem-sucedido",
                description: "Bem-vindo, Admin!",
              });
              
              navigate('/dashboard');
              return;
            }
          } catch (adminError: any) {
            console.error("Special admin flow failed:", adminError);
          }
        }
        
        setAuthError(error.message);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Falha na autenticação. Tente novamente com as credenciais de demonstração.",
        });
      }
    } catch (error: any) {
      console.error("Exception during login:", error);
      setAuthError(error.message);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha na autenticação. Tente novamente com as credenciais de demonstração.",
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
        <div className="text-sm text-muted-foreground border-2 border-red-300 bg-red-50 p-3 rounded">
          <p className="font-bold mb-2">⚠️ Importante: Use exatamente estas credenciais:</p>
          <p>Para entrar como admin:</p>
          <p>Email: <span className="font-mono">atalegre@me.com</span></p>
          <p className="font-semibold mb-2">Password: <span className="font-mono">admin123</span></p>
          <p>Para entrar como cliente:</p>
          <p>Email: <span className="font-mono">seoclient@exemplo.com</span></p>
          <p className="font-semibold">Password: <span className="font-mono">client123</span></p>
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
