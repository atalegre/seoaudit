
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorStateProps {
  error: string;
  onReturnHome: () => void;
  onReanalyze: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  error, 
  onReturnHome, 
  onReanalyze 
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold mb-4">Erro na Análise</h1>
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Falha na análise</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          <p className="mb-6">Verifique as configurações de API e tente novamente.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={onReturnHome}>Voltar à página inicial</Button>
            <Button variant="outline" onClick={onReanalyze}>Tentar novamente</Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ErrorState;
