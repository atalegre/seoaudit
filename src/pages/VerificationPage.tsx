
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthCard from '@/components/auth/AuthCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, ExternalLink, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
        const role = session?.user?.email === 'atalegre@me.com' ? 'admin' : 'user';
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
    if (isResending) return;
    
    setIsResending(true);
    try {
      if (!email) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Email não encontrado.",
        });
        setIsResending(false);
        return;
      }

      setVerificationAttempts(prev => prev + 1);
      console.log(`Resending verification email attempt #${verificationAttempts + 1}`);

      // Try both methods to maximize chances of email delivery
      
      // 1. First try our custom email function
      try {
        console.log('Sending custom verification email');
        await supabase.functions.invoke('send-email', {
          body: {
            type: 'confirmation',
            email,
            name: 'Utilizador',
            confirmationUrl: `${window.location.origin}/verification?email=${encodeURIComponent(email)}`
          }
        });
        console.log('Custom email sent successfully');
      } catch (err) {
        console.error('Error sending custom verification email:', err);
        // Continue with standard Supabase email as fallback
      }
      
      // 2. Try standard Supabase resend
      try {
        console.log('Sending standard Supabase verification email');
        await supabase.auth.resend({
          type: 'signup',
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/verification?email=${encodeURIComponent(email)}`
          }
        });
        console.log('Standard verification email sent successfully');
      } catch (err) {
        console.error('Error sending standard verification email:', err);
      }
      
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

  const checkSpamInstructions = (
    <div className="text-sm text-muted-foreground mt-4">
      <p className="font-medium">Não recebeu o email?</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>Verifique a sua pasta de spam ou lixo eletrónico</li>
        <li>Adicione no-reply@seoaudit.pt aos seus contactos</li>
        <li>Aguarde alguns minutos, pois os emails podem demorar a chegar</li>
      </ul>
    </div>
  );

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
        <div className="space-y-6">
          {emailSent && (
            <Alert className="mb-6 border-green-500/50 bg-green-500/10">
              <AlertTitle>Email Enviado</AlertTitle>
              <AlertDescription>
                Email reenviado com sucesso. Por favor verifique a sua caixa de entrada e pasta de spam.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            
            <h3 className="text-lg font-medium">Verifique o seu email</h3>
            
            <p className="text-sm text-muted-foreground">
              Enviámos um link de verificação para{" "}
              <span className="font-medium text-foreground">{email}</span>.
            </p>
            
            <p className="text-sm text-muted-foreground mt-2">
              Por favor clique no link enviado para o email para verificar a sua conta.
            </p>
          </div>
          
          <div className="border rounded-lg p-4 bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink size={18} className="text-primary" />
              <h4 className="font-medium">O que fazer a seguir:</h4>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Verifique a sua caixa de entrada de email (e a pasta de spam)</li>
              <li>Clique no link "Confirmar conta" no email recebido</li>
              <li>Você será redirecionado automaticamente após a verificação</li>
            </ol>
          </div>
          
          {checkSpamInstructions}
          
          <Button 
            variant="default" 
            className="w-full"
            onClick={handleResendVerification}
            disabled={isResending}
          >
            {isResending ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin mr-2" /> A reenviar...
              </>
            ) : (
              <>Reenviar email de verificação</>
            )}
          </Button>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default VerificationPage;
