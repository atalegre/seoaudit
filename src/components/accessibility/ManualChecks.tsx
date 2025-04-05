
import React from 'react';
import { Info } from 'lucide-react';

interface ManualChecksProps {
  checks: string[];
}

const ManualChecks = ({ checks }: ManualChecksProps) => {
  return (
    <div className="mt-6">
      <h4 className="text-sm font-medium mb-2">Verificações Manuais Recomendadas:</h4>
      <ul className="space-y-1 text-sm">
        {checks.map((check, index) => (
          <li key={index} className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-500 mt-0.5" />
            <span>{check}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManualChecks;
