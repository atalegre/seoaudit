
import React from 'react';
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { verifyOTP } from '@/utils/auth/authService';

interface VerificationCodeInputProps {
  email: string;
  onVerificationSuccess: () => void;
}

const VerificationCodeInput = ({ email, onVerificationSuccess }: VerificationCodeInputProps) => {
  const [verificationCode, setVerificationCode] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      setError('Por favor, insira o código completo de 6 dígitos.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      await verifyOTP(email, verificationCode);
      toast({
        title: "Verificação bem-sucedida",
        description: "O seu email foi verificado com sucesso.",
      });
      onVerificationSuccess();
    } catch (error: any) {
      console.error('Error verifying code:', error);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Erro na verificação",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 mt-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-medium">Verificação de Email</h3>
        <p className="text-sm text-muted-foreground">
          Insira o código de 6 dígitos enviado para {email}
        </p>
      </div>
      
      {error && (
        <div className="text-sm text-destructive text-center">
          {error}
        </div>
      )}
      
      <div className="flex justify-center">
        <InputOTP 
          maxLength={6} 
          value={verificationCode} 
          onChange={setVerificationCode}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      
      <Button 
        onClick={handleVerify} 
        disabled={isSubmitting || verificationCode.length !== 6}
        className="w-full"
      >
        {isSubmitting ? 'Verificando...' : 'Verificar'}
      </Button>
      
      <div className="text-center">
        <Button 
          variant="link" 
          onClick={() => {
            // Reset form for clarity
            setVerificationCode('');
            setError(null);
          }}
        >
          Não recebeu o código? Tentar novamente
        </Button>
      </div>
    </div>
  );
};

export default VerificationCodeInput;
