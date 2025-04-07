
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { signUpWithEmail } from '@/utils/auth/authService';
import { signupFormSchema, SignUpFormValues } from './schemas/signupSchema';
import EmailField from './EmailField';
import PasswordField from './PasswordField';
import PasswordRequirements from './PasswordRequirements';
import NameField from './NameField';
import TermsCheckbox from './TermsCheckbox';

type SignUpFormProps = {
  setAuthError: (error: string | null) => void;
};

const SignUpForm = ({ setAuthError }: SignUpFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      acceptTerms: false,
    },
  });

  async function onSubmit(values: SignUpFormValues) {
    setIsRegistering(true);
    setAuthError(null);
    
    try {
      // Special case for admin email
      const isAdminEmail = values.email === 'atalegre@me.com';
      const role = isAdminEmail ? 'admin' : 'user';
      
      console.log('Submitting signup form with email:', values.email);
      
      const result = await signUpWithEmail({
        name: values.name,
        email: values.email,
        password: values.password,
        acceptTerms: values.acceptTerms,
        role: role
      });
      
      if (result?.session) {
        // User was signed in automatically
        console.log('User signed in automatically:', result.user?.email);
        
        toast({
          title: "Registo bem-sucedido",
          description: "A sua conta foi criada com sucesso!",
        });
        
        // Redirect based on role
        navigate(role === 'admin' ? '/dashboard' : '/dashboard/client');
      } else if (result?.user) {
        // Email confirmation may be required
        console.log('Email confirmation may be required for:', result.user?.email);
        
        toast({
          title: "Registo bem-sucedido",
          description: "Enviamos um email de confirmação. Por favor verifique sua caixa de entrada.",
          duration: 8000,
        });
        
        // For admin, try to redirect to dashboard
        if (isAdminEmail) {
          navigate('/dashboard');
        } else {
          // Navigate to verification page
          navigate('/verification', { 
            state: { email: values.email },
            replace: true
          });
        }
      } else {
        // Unexpected result
        console.error('Unexpected signup result:', result);
        
        toast({
          variant: "destructive",
          title: "Erro no registo",
          description: "Ocorreu um erro inesperado durante o registo.",
        });
      }
    } catch (error: any) {
      console.error("Exception during registration:", error);
      
      // Handle admin-specific authentication errors
      if (values.email === 'atalegre@me.com') {
        if (error.message?.includes('Credenciais inválidas')) {
          toast({
            variant: "destructive",
            title: "Erro de Autenticação",
            description: error.message,
          });
        } else if (error.message?.includes('já está registrado') || 
                  error.message?.includes('already registered')) {
          toast({
            title: "Admin já registrado",
            description: "Tentando fazer login como administrador...",
          });
          
          // Try to directly navigate to login with admin credentials
          navigate('/signin', { 
            state: { email: values.email },
            replace: true
          });
        } else {
          setAuthError(error.message);
          toast({
            variant: "destructive",
            title: "Erro no Admin",
            description: error.message || "Ocorreu um erro durante o registo do administrador.",
          });
        }
        return;
      }
      
      // Handle user already registered error
      if (error.message?.includes('User already registered') || 
          error.message?.includes('já está em uso') || 
          error.message?.includes('já está registrado')) {
        toast({
          title: "Usuário já registrado",
          description: "Este email já está registrado. Por favor, faça login.",
        });
        navigate('/signin', { 
          state: { email: form.getValues().email },
          replace: true
        });
      } else {
        setAuthError(error.message);
        toast({
          variant: "destructive",
          title: "Erro",
          description: error.message || "Ocorreu um erro durante o registo.",
        });
      }
    } finally {
      setIsRegistering(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <NameField form={form} />
        <EmailField form={form} />
        <PasswordField form={form} name="password" />
        <PasswordRequirements />
        <TermsCheckbox form={form} />
        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={isRegistering}
        >
          {isRegistering ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registando...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" /> Registrar
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
