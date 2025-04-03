
import React from 'react';
import { Mail } from 'lucide-react';

interface VerificationHeaderProps {
  email: string;
}

const VerificationHeader = ({ email }: VerificationHeaderProps) => {
  return (
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
  );
};

export default VerificationHeader;
