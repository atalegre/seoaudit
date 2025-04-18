
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogIn } from 'lucide-react';

type SignInFormProps = {
  email?: string;
  returnTo?: string;
  setAuthError: (error: string | null) => void;
  onSuccess?: () => void;
};

const SignInForm = ({ email, returnTo, setAuthError, onSuccess }: SignInFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [emailValue, setEmailValue] = useState(email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Get URL parameters
  const redirectPath = searchParams.get('redirect') || returnTo;
  const urlParam = searchParams.get('url');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailValue,
        password,
      });

      if (error) {
        setAuthError(error.message);
        toast({
          variant: "destructive",
          title: "Erro ao iniciar sessão",
          description: error.message,
        });
      } else if (data.session) {
        toast({
          title: "Sessão iniciada com sucesso!",
          description: "Bem-vindo de volta.",
        });
        
        // Check if there's an onSuccess callback
        if (onSuccess) {
          onSuccess();
        } else {
          // Determine redirect path based on user role
          const userRole = data.user?.user_metadata?.role || 'user';
          
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
            // Redirect based on user role
            if (userRole === 'admin') {
              navigate('/dashboard');
            } else {
              navigate(redirectPath || '/suite');
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Exception during login:", error);
      setAuthError(error.message);
      
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Erro ao iniciar sessão",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="O teu email"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="A tua palavra-passe"
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
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> A iniciar sessão...</>
        ) : (
          <><LogIn className="mr-2 h-4 w-4" /> Iniciar Sessão</>
        )}
      </Button>

      <div className="mt-4 text-center text-sm">
        <Link to="/recuperar-password" className="text-primary hover:underline">
          Esqueceu a password?
        </Link>
      </div>
    </form>
  );
};

export default SignInForm;
