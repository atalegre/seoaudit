
import React from 'react';
import { ExternalLink } from 'lucide-react';

const VerificationInstructions = () => {
  return (
    <div className="border rounded-lg p-4 bg-muted/30">
      <div className="flex items-center gap-2 mb-2">
        <ExternalLink size={18} className="text-primary" />
        <h4 className="font-medium">O que fazer a seguir:</h4>
      </div>
      <ol className="list-decimal list-inside space-y-1 text-sm">
        <li>Verifique a sua caixa de entrada de email (e a pasta de spam)</li>
        <li>Clique no link "Confirmar conta" no email recebido</li>
        <li>Você será redirecionado automaticamente após a verificação</li>
      </ol>
    </div>
  );
};

export default VerificationInstructions;
