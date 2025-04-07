
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const LoginRequiredAlert: React.FC = () => {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Login necessário</AlertTitle>
      <AlertDescription>
        Para verificar a indexação, faça login e configure o acesso ao Google Search Console.
      </AlertDescription>
    </Alert>
  );
};

export default LoginRequiredAlert;
