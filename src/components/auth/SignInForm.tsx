
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { LogIn, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import EmailField from './EmailField';
import PasswordField from './PasswordField';
import { signinFormSchema, SigninFormValues } from './schemas/signinSchema';
import { useSignIn } from './hooks/useSignIn';
import { useLanguage } from '@/contexts/LanguageContext';

type SignInFormProps = {
  email?: string;
  returnTo?: string;
  setAuthError: (error: string | null) => void;
};

const SignInForm = ({ email, returnTo, setAuthError }: SignInFormProps) => {
  const form = useForm<SigninFormValues>({
    resolver: zodResolver(signinFormSchema),
    defaultValues: {
      email: email || '',
      password: '',
    },
  });

  const { isLoggingIn, handleSignIn } = useSignIn(setAuthError);
  const { t } = useLanguage();

  const onSubmit = (values: SigninFormValues) => {
    handleSignIn(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <EmailField form={form} />
        <PasswordField form={form} name="password" />
        
        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('logging-in')}...</>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" /> {t('sign-in')}
            </>
          )}
        </Button>

        <div className="mt-4 text-center text-sm">
          <Link to="/recuperar-password" className="text-primary hover:underline">
            {t('forgot-password') || "Esqueceu a password?"}
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default SignInForm;
