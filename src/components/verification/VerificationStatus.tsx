
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface VerificationStatusProps {
  emailSent: boolean;
}

const VerificationStatus = ({ emailSent }: VerificationStatusProps) => {
  if (!emailSent) return null;
  
  return (
    <Alert className="mb-6 border-green-500/50 bg-green-500/10">
      <AlertTitle>Email Enviado</AlertTitle>
      <AlertDescription>
        Email reenviado com sucesso. Por favor verifique a sua caixa de entrada e pasta de spam.
      </AlertDescription>
    </Alert>
  );
};

export default VerificationStatus;
