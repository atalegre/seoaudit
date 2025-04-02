
import React from 'react';
import { Mail, ExternalLink } from 'lucide-react';

interface VerificationCodeInputProps {
  email: string;
  onVerificationSuccess: () => void;
}

const VerificationCodeInput = ({ email }: VerificationCodeInputProps) => {
  return (
    <div className="space-y-6 mt-6">
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
          Por favor clique no link enviado para verificar a sua conta.
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
    </div>
  );
};

export default VerificationCodeInput;
