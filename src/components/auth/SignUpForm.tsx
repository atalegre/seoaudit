
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { sendVerificationEmail } from '@/utils/auth/emailVerificationService';

interface SignUpFormProps {
  setAuthError: (error: string | null) => void;
  onSuccess?: () => void;
  returnTo?: string;
}

const SignUpForm = ({ setAuthError, onSuccess, returnTo }: SignUpFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Get URL parameters
  const redirectPath = searchParams.get('redirect') || returnTo;
  const urlParam = searchParams.get('url');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        setAuthError(error.message);
        toast({
          variant: "destructive",
          title: "Erro ao registar",
          description: error.message,
        });
      } else if (data.user) {
        // Send verification email automatically
        const emailSent = await sendVerificationEmail(email);
        
        if (emailSent) {
          console.log('Email de verificação enviado com sucesso durante o signup');
        } else {
          console.warn('Não foi possível enviar o email automaticamente durante o signup');
        }
        
        toast({
          title: "Conta criada com sucesso!",
          description: "Verifique seu e-mail para confirmar o cadastro.",
        });
        
        if (onSuccess) {
          onSuccess();
        } else if (data.session) {
          // User was auto-signed in
          
          // If we have a URL parameter, use it for analysis after login
          if (urlParam && redirectPath === 'suite') {
            // If redirect is to suite with URL, navigate there with the URL as parameter
            navigate(`/suite?url=${encodeURIComponent(urlParam)}`);
          } else if (sessionStorage.getItem('pendingAnalysisUrl') && redirectPath === 'suite') {
            // Use stored URL from session storage if available
            const pendingUrl = sessionStorage.getItem('pendingAnalysisUrl');
            sessionStorage.removeItem('pendingAnalysisUrl');
            navigate(`/suite?url=${encodeURIComponent(pendingUrl || '')}`);
          } else {
            // Navigate to the specified return path or default
            navigate(redirectPath || '/suite');
          }
        } else {
          // Email verification required
          navigate('/verification', { 
            state: { 
              email: email, 
              emailSent: emailSent,
              returnTo: redirectPath,
              url: urlParam
            } 
          });
        }
      }
    } catch (error: any) {
      console.error("Exception during signup:", error);
      setAuthError(error.message);
      
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Erro ao criar conta",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="O teu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Cria uma palavra-passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={loading} 
        className="w-full"
        size="lg"
      >
        {loading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> A criar conta...</>
        ) : (
          'Criar Conta'
        )}
      </Button>
    </form>
  );
};

export default SignUpForm;
