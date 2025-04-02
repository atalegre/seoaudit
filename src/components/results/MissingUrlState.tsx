
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

interface MissingUrlStateProps {
  onReturnHome: () => void;
}

const MissingUrlState: React.FC<MissingUrlStateProps> = ({ onReturnHome }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">URL em falta</h1>
          <p className="mb-6">Não foi possível analisar o URL. Por favor, tente novamente.</p>
          <Button onClick={onReturnHome}>Voltar à página inicial</Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MissingUrlState;
