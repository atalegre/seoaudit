
import React from 'react';
import { Sparkles } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="text-center p-8 border rounded-md bg-gray-50">
      <div className="flex justify-center mb-4">
        <div className="p-3 rounded-full bg-primary/10">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
      </div>
      <h3 className="text-lg font-medium mb-2">Sem recomendações ainda</h3>
      <p className="text-muted-foreground">
        Preencha o formulário acima e clique em "Gerar sugestões" para receber sugestões de conteúdo.
      </p>
    </div>
  );
};

export default EmptyState;
