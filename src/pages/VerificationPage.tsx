
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthCard from '@/components/auth/AuthCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, ExternalLink } from 'lucide-react';

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

  const handleReturnToLogin = () => {
    localStorage.removeItem('pendingVerificationEmail');
    navigate('/signin');
  };

  const handleResendVerification = async () => {
    try {
      if (!email) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Email não encontrado.",
        });
        return;
      }

      await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
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
        <div className="space-y-6">
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
              <li>Verifique a sua caixa de entrada de email</li>
              <li>Clique no link "Confirmar conta" no email recebido</li>
              <li>Você será redirecionado automaticamente após a verificação</li>
            </ol>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full" 
            onClick={handleResendVerification}
          >
            Não recebeu o email? Reenviar
          </Button>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default VerificationPage;
