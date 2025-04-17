
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2, Mail } from 'lucide-react';
import { resetPassword } from '@/utils/auth/passwordService';

type PasswordResetFormProps = {
  setAuthError: (error: string | null) => void;
};

const PasswordResetForm = ({ setAuthError }: PasswordResetFormProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    try {
      // Using the passwordService utility to handle reset
      const result = await resetPassword(email);

      if (!result.success && result.error) {
        setAuthError(result.error.message);
        toast({
          variant: "destructive",
          title: "Erro ao enviar email de recuperação",
          description: result.error.message,
        });
      } else {
        setSent(true);
        toast({
          title: "Email de recuperação enviado!",
          description: "Verifique sua caixa de entrada para redefinir sua senha.",
        });
      }
    } catch (error: any) {
      console.error("Exception during password reset:", error);
      setAuthError(error.message);
      
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Erro ao enviar email de recuperação",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleReset} className="space-y-6">
      {sent ? (
        <div className="text-center py-4 px-6 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">
            Email de recuperação enviado para <strong>{email}</strong>. Verifique sua caixa de entrada.
          </p>
        </div>
      ) : (
        <>
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

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full"
            size="lg"
          >
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> A enviar...</>
            ) : (
              <><Mail className="mr-2 h-4 w-4" /> Recuperar Palavra-passe</>
            )}
          </Button>
        </>
      )}
    </form>
  );
};

export default PasswordResetForm;
