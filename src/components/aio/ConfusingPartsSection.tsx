
import React from 'react';
import { AlertCircle } from 'lucide-react';
import ConfusingPart from './ConfusingPart';

interface ConfusingPartsSectionProps {
  confusingParts: string[];
}

const ConfusingPartsSection: React.FC<ConfusingPartsSectionProps> = ({ confusingParts }) => {
  if (confusingParts.length === 0) return null;
  
  return (
    <div className="pt-2 border-t">
      <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
        <AlertCircle className="h-4 w-4 text-red-500" />
        Partes Confusas
      </h3>
      <div className="space-y-2">
        {confusingParts.map((part, index) => (
          <ConfusingPart key={index} text={part} />
        ))}
      </div>
    </div>
  );
};

export default ConfusingPartsSection;
