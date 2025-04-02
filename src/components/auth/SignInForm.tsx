
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import EmailField from './EmailField';
import PasswordField from './PasswordField';
import { signInWithEmail } from '@/utils/auth/signinService';
import { checkUserRole } from '@/utils/auth/userProfileService';
import { createOrUpdateAdmin, createOrUpdateClient } from '@/utils/auth/createDefaultUsers';

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
      
      // Pre-setup demo accounts if that's what we're trying to log in with
      if (values.email === 'atalegre@me.com') {
        await createOrUpdateAdmin();
      } else if (values.email === 'seoclient@exemplo.com') {
        await createOrUpdateClient();
      }
      
      // Attempt to sign in with email and password
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
        console.log("Login successful:", data);
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo de volta!",
        });
        
        // Determine where to redirect based on user role
        try {
          const userRole = await checkUserRole(data.user.id);
          console.log("User role:", userRole);
          
          if (userRole === 'admin') {
            navigate('/dashboard');
          } else {
            navigate('/dashboard/client');
          }
        } catch (roleError) {
          console.error("Error checking role:", roleError);
          // Default to client dashboard if role check fails
          navigate('/dashboard/client');
        }
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
