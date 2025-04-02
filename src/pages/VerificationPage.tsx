
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthCard from '@/components/auth/AuthCard';
import VerificationCodeInput from '@/components/auth/VerificationCodeInput';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const VerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState<string>('');
  
  useEffect(() => {
    // Get email from location state or localStorage
    const stateEmail = location.state?.email;
    const storedEmail = localStorage.getItem('pendingVerificationEmail');
    
    if (stateEmail) {
      setEmail(stateEmail);
      // Store email in localStorage in case the page is refreshed
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
  }, [location, navigate, toast]);

  const handleVerificationSuccess = () => {
    // Clear the stored email
    localStorage.removeItem('pendingVerificationEmail');
    // Redirect to dashboard
    navigate('/dashboard/client');
  };

  const handleReturnToLogin = () => {
    localStorage.removeItem('pendingVerificationEmail');
    navigate('/signin');
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
        {email ? (
          <VerificationCodeInput
            email={email}
            onVerificationSuccess={handleVerificationSuccess}
          />
        ) : (
          <div className="text-center">Carregando...</div>
        )}
      </AuthCard>
    </AuthLayout>
  );
};

export default VerificationPage;
