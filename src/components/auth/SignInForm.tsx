
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { LogIn, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import EmailField from './EmailField';
import PasswordField from './PasswordField';
import { signInWithEmail } from '@/utils/auth/signinService';
import { supabase } from '@/integrations/supabase/client';

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
      
      // Special handling for admin account
      if (values.email === 'atalegre@me.com' && values.password === 'admin123') {
        console.log("Admin login attempt detected");
        
        // Direct attempt to sign in admin
        const { data: adminSignInResult, error: adminSignInError } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        
        if (adminSignInError) {
          console.log("Admin login failed, trying to create admin account");
          
          // Try to create admin account
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
            options: {
              data: {
                full_name: 'Admin User',
                role: 'admin'
              }
            }
          });
          
          if (signUpError && !signUpError.message.includes("User already registered")) {
            console.error("Error creating admin account:", signUpError);
            setAuthError(signUpError.message);
            toast({
              variant: "destructive",
              title: "Erro",
              description: signUpError.message || "Erro ao criar conta de administrador",
            });
            setIsLoggingIn(false);
            return;
          }
          
          // Try to sign in again
          const { data: retrySignIn, error: retryError } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
          });
          
          if (retryError) {
            console.error("Admin login retry failed:", retryError);
            setAuthError(retryError.message);
            toast({
              variant: "destructive",
              title: "Erro de autenticação",
              description: retryError.message || "Falha ao autenticar como administrador",
            });
            setIsLoggingIn(false);
            return;
          }
          
          if (retrySignIn?.user) {
            console.log("Admin login successful after account creation");
            
            // Ensure admin record in database
            try {
              const { error: upsertError } = await supabase
                .from('users')
                .upsert({
                  id: retrySignIn.user.id,
                  name: 'Admin User',
                  email: values.email,
                  role: 'admin',
                  updated_at: new Date().toISOString()
                }, { onConflict: 'id' });
              
              if (upsertError) {
                console.error("Error ensuring admin record:", upsertError);
              }
            } catch (err) {
              console.error("Exception ensuring admin record:", err);
            }
            
            toast({
              title: "Login bem-sucedido",
              description: "Bem-vindo, Admin!",
            });
            
            navigate('/dashboard');
            return;
          }
        }
        
        if (adminSignInResult?.user) {
          console.log("Admin login successful");
          
          // Ensure admin record in database
          try {
            const { error: upsertError } = await supabase
              .from('users')
              .upsert({
                id: adminSignInResult.user.id,
                name: 'Admin User',
                email: values.email,
                role: 'admin',
                updated_at: new Date().toISOString()
              }, { onConflict: 'id' });
            
            if (upsertError) {
              console.error("Error ensuring admin record:", upsertError);
            }
          } catch (err) {
            console.error("Exception ensuring admin record:", err);
          }
          
          toast({
            title: "Login bem-sucedido",
            description: "Bem-vindo, Admin!",
          });
          
          navigate('/dashboard');
          return;
        }
      }
      
      // Regular login flow for all other accounts
      const { data, error } = await signInWithEmail(values.email, values.password);
      
      if (error) {
        console.error("Login error:", error);
        setAuthError(error.message || "Authentication failed");
        
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: `${error.message || "Email ou password incorretos"}. Tente as credenciais de demonstração listadas abaixo.`,
        });
        setIsLoggingIn(false);
        return;
      } 
      
      if (data?.user) {
        console.log("Login successful:", data.user);
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo de volta!",
        });
        
        // Check user role to determine where to navigate
        let role = 'user';
        
        // Special case for admin email
        if (values.email === 'atalegre@me.com') {
          role = 'admin';
        } else {
          // Check user metadata first
          role = data.user.user_metadata?.role || 'user';
          
          // If not in metadata, check database
          if (role !== 'admin') {
            try {
              const { data: userData } = await supabase
                .from('users')
                .select('role')
                .eq('id', data.user.id)
                .maybeSingle();
              
              if (userData?.role === 'admin') {
                role = 'admin';
              }
            } catch (err) {
              console.error("Error checking user role:", err);
            }
          }
        }
        
        // Navigate based on role
        console.log("Navigating based on role:", role);
        navigate(role === 'admin' ? '/dashboard' : '/dashboard/client');
      } else {
        setAuthError("Unknown error during authentication");
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Ocorreu um erro desconhecido durante a autenticação.",
        });
        setIsLoggingIn(false);
      }
    } catch (error: any) {
      console.error("Exception during login:", error);
      setAuthError(error.message || "Erro de autenticação");
      
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha na autenticação. Tente novamente com as credenciais de demonstração.",
      });
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
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Entrando...</>
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
