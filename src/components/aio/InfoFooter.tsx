
import React from 'react';
import { BrainCircuit } from 'lucide-react';

const InfoFooter: React.FC = () => {
  return (
    <div className="pt-3 border-t">
      <div className="flex items-start gap-2 p-2 rounded-md bg-purple-50">
        <BrainCircuit className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-purple-800">
          AIO avalia como modelos de IA compreendem seu conteúdo. Uma pontuação alta indica que seu site está bem otimizado para interações com IA generativa.
        </p>
      </div>
    </div>
  );
};

export default InfoFooter;
