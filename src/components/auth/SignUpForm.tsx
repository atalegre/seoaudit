
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { signUpWithEmail } from '@/utils/auth/signupService';
import NameField from './NameField';
import EmailField from './EmailField';
import PasswordField from './PasswordField';
import TermsCheckbox from './TermsCheckbox';
import { signupFormSchema, SignUpFormValues } from './schemas/signupSchema';

type SignUpFormProps = {
  setAuthError: (error: string | null) => void;
};

const SignUpForm = ({ setAuthError }: SignUpFormProps) => {
  const navigate = useNavigate();
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

  const onSubmit = async (values: SignUpFormValues) => {
    try {
      setIsRegistering(true);
      setAuthError(null);
      
      console.log('Submitting signup form with email:', values.email);
      
      const result = await signUpWithEmail({
        name: values.name,
        email: values.email,
        password: values.password,
        acceptTerms: values.acceptTerms
      });
      
      if (result.needsEmailVerification) {
        toast({
          title: "Verificação de email necessária",
          description: "Por favor, verifique o seu email para continuar.",
        });
        
        navigate('/verification', { 
          state: { email: values.email } 
        });
      } else if (result.user) {
        toast({
          title: "Conta criada com sucesso",
          description: "Bem-vindo à nossa plataforma!",
        });
        
        // Check role for redirect
        const role = result.user.user_metadata?.role || 'user';
        navigate(role === 'admin' ? '/dashboard' : '/dashboard/client');
      }
    } catch (error: any) {
      console.error("Exception during registration:", error);
      setAuthError(error.message || "Erro ao criar conta");
      
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível criar a sua conta",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <NameField form={form} />
        <EmailField form={form} />
        <PasswordField form={form} name="password" />
        <TermsCheckbox form={form} />
        
        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={isRegistering}
        >
          {isRegistering ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Criando conta...</>
          ) : (
            <><UserPlus className="mr-2 h-4 w-4" /> Criar Conta</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
