
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthCard from '@/components/auth/AuthCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import VerificationContent from '@/components/verification/VerificationContent';

const VerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState<string>('');
  const [isResending, setIsResending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  
  useEffect(() => {
    // Get email from location state, query params, or localStorage
    const params = new URLSearchParams(location.search);
    const queryEmail = params.get('email');
    const stateEmail = location.state?.email;
    const storedEmail = localStorage.getItem('pendingVerificationEmail');
    
    // Verifique o status do email enviado do estado
    const stateEmailSent = location.state?.emailSent;
    if (stateEmailSent) {
      setEmailSent(true);
    }
    
    if (queryEmail) {
      setEmail(queryEmail);
      localStorage.setItem('pendingVerificationEmail', queryEmail);
    } else if (stateEmail) {
      setEmail(stateEmail);
      localStorage.setItem('pendingVerificationEmail', stateEmail);
    } else if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // If no email is found, redirect to sign in
      toast({
        variant: "destructive",
        title: "Erro de verificação",
        description: "Não foi possível encontrar o email para verificação.",
      });
      navigate('/signin');
    }
    
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard/client');
      }
    });

    // Setup listener for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event in verification page:", event);
      
      if (event === 'SIGNED_IN') {
        toast({
          title: "Conta verificada",
          description: "A sua conta foi verificada com sucesso!",
        });
        
        // Clear stored email since verification is complete
        localStorage.removeItem('pendingVerificationEmail');
        
        // Navigate to appropriate dashboard
        const role = session?.user?.user_metadata?.role === 'admin' ? 'admin' : 'user';
        navigate(role === 'admin' ? '/dashboard' : '/dashboard/client');
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [location, navigate, toast]);

  const handleReturnToLogin = () => {
    localStorage.removeItem('pendingVerificationEmail');
    navigate('/signin');
  };

  const handleResendVerification = async () => {
    if (isResending || !email) return;
    
    setIsResending(true);
    try {
      setVerificationAttempts(prev => prev + 1);
      console.log(`Resending verification email attempt #${verificationAttempts + 1} to ${email}`);
      
      // Create confirmation URL - making sure it's absolute and includes origin
      const confirmationUrl = `${window.location.origin}/auth/callback?next=/dashboard/client`;
      console.log('Using confirmation URL:', confirmationUrl);

      // First try our custom email function (this should be more reliable)
      try {
        console.log('Sending custom verification email via function');
        const functionResponse = await supabase.functions.invoke('send-email', {
          body: {
            type: 'confirmation',
            email,
            name: 'Utilizador', // Generic name for resend
            confirmationUrl
          }
        });
        
        console.log('Custom email function response:', functionResponse);
        
        if (functionResponse.error) {
          throw new Error(`Custom email error: ${JSON.stringify(functionResponse.error)}`);
        }
        
        console.log('Custom email function succeeded');
        setEmailSent(true);
        toast({
          title: "Email reenviado",
          description: "Um novo link de verificação foi enviado para o seu email.",
        });
        
        // If custom email succeeds, we can return early
        setIsResending(false);
        return;
      } catch (customErr) {
        console.error('Error sending custom verification email:', customErr);
        // Continue with standard Supabase email as fallback
      }
      
      // Fallback to standard Supabase auth resend
      console.log('Falling back to standard Supabase verification email');
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: confirmationUrl
        }
      });
      
      if (error) {
        console.error('Error from Supabase resend:', error);
        throw error;
      }
      
      console.log('Standard verification email sent successfully');
      setEmailSent(true);
      toast({
        title: "Email reenviado",
        description: "Um novo link de verificação foi enviado para o seu email.",
      });
    } catch (error: any) {
      console.error('Error resending verification:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível reenviar o email de verificação.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard 
        title="Verificação de Email"
        description="Verifique o seu email para continuar"
        footer={
          <Button variant="outline" className="w-full" onClick={handleReturnToLogin}>
            Voltar ao login
          </Button>
        }
      >
        <VerificationContent
          email={email}
          emailSent={emailSent}
          isResending={isResending}
          handleResendVerification={handleResendVerification}
        />
      </AuthCard>
    </AuthLayout>
  );
};

export default VerificationPage;
