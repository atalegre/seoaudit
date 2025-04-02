
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
      // Make sure we're passing all required fields from the form values
      const data = await signUpWithEmail({
        name: values.name,
        email: values.email,
        password: values.password,
        acceptTerms: values.acceptTerms
      });
      
      if (data?.session) {
        // User was signed in automatically
        toast({
          title: "Registo bem-sucedido",
          description: "A sua conta foi criada com sucesso!",
        });
        // Always redirect to client dashboard
        navigate('/dashboard/client');
      } else {
        // Email confirmation required
        toast({
          title: "Registo iniciado",
          description: "Por favor verifique o seu email para confirmar a sua conta.",
        });
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
