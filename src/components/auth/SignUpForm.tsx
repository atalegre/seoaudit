
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { signUpWithEmail } from '@/utils/auth/authService';
import { signupFormSchema, SignUpFormValues } from './schemas/signupSchema';
import EmailField from './EmailField';
import PasswordField from './PasswordField';
import PasswordRequirements from './PasswordRequirements';
import NameField from './NameField';
import TermsCheckbox from './TermsCheckbox';
import { supabase } from '@/integrations/supabase/client';

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

  // Função para enviar email de confirmação
  async function sendConfirmationEmail(email: string, name: string, confirmationUrl: string) {
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'confirmation',
          email,
          name,
          confirmationUrl
        }
      });

      if (error) {
        console.error("Erro ao enviar email de confirmação:", error);
      } else {
        console.log("Email de confirmação enviado:", data);
      }
    } catch (error) {
      console.error("Exceção ao enviar email de confirmação:", error);
    }
  }

  async function onSubmit(values: SignUpFormValues) {
    setIsRegistering(true);
    setAuthError(null);
    
    try {
      // Store email for verification process
      localStorage.setItem('pendingVerificationEmail', values.email);
      
      // Set role to admin if email is atalegre@me.com, otherwise use user
      const role = values.email === 'atalegre@me.com' ? 'admin' : 'user';
      
      // Make sure we're passing all required fields from the form values
      const data = await signUpWithEmail({
        name: values.name,
        email: values.email,
        password: values.password,
        acceptTerms: values.acceptTerms,
        role: role // Pass the determined role
      });
      
      if (data?.session) {
        // User was signed in automatically
        toast({
          title: "Registo bem-sucedido",
          description: "A sua conta foi criada com sucesso!",
        });
        // Redirect based on role
        navigate(role === 'admin' ? '/dashboard' : '/dashboard/client');
      } else {
        // Email confirmation required
        // Construir URL de confirmação - normalmente é enviado pelo próprio Supabase
        // mas simulamos aqui para o email de confirmação customizado
        const confirmationUrl = `${window.location.origin}/auth/callback?next=${role === 'admin' ? '/dashboard' : '/dashboard/client'}`;
        
        // Enviar email de confirmação personalizado
        await sendConfirmationEmail(values.email, values.name, confirmationUrl);
        
        toast({
          title: "Registo iniciado",
          description: "Por favor verifique o seu email para confirmar a sua conta.",
        });
        
        // Navigate to verification page
        navigate('/verification', { state: { email: values.email } });
      }
    } catch (error: any) {
      console.error("Exception during registration:", error);
      setAuthError(error.message);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      });
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
            <>Registando...</>
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
