
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2, LogIn } from 'lucide-react';

type SignInFormProps = {
  email?: string;
  returnTo?: string;
  setAuthError: (error: string | null) => void;
  onSuccess?: () => void;
};

const SignInForm = ({ email, returnTo, setAuthError, onSuccess }: SignInFormProps) => {
  const navigate = useNavigate();
  const [emailValue, setEmailValue] = useState(email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
          // Check if we should redirect to a specific path or to the subdomain
          const isDevelopment = window.location.hostname === 'localhost' || 
                             window.location.hostname.includes('lovable');
          
          if (isDevelopment) {
            // For development - navigate to local route
            navigate(returnTo || '/suite');
          } else {
            // For production - redirect to the suite subdomain in a new tab
            const lastAnalyzedUrl = localStorage.getItem('lastAnalyzedUrl');
            const queryParam = lastAnalyzedUrl ? `?url=${encodeURIComponent(lastAnalyzedUrl)}` : '';
            window.open(`https://suite.seoaudit.pt${queryParam}`, '_blank');
            
            // Navigate to the homepage in the current tab
            navigate('/');
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
