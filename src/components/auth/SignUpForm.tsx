
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface SignUpFormProps {
  setAuthError: (error: string | null) => void;
  onSuccess?: () => void;
}

const SignUpForm = ({ setAuthError, onSuccess }: SignUpFormProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
        toast({
          title: "Conta criada com sucesso!",
          description: "Verifique seu e-mail para confirmar o cadastro.",
        });
        
        if (onSuccess) {
          onSuccess();
        } else if (data.session) {
          // User was auto-signed in
          navigate('/suite');
        } else {
          // Email verification required
          navigate('/verification', { 
            state: { email: email } 
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
