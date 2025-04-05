
import React from 'react';
import { Loader2 } from 'lucide-react';

interface ReanalyzeButtonProps {
  onReanalyze: () => void;
}

const ReanalyzeButton: React.FC<ReanalyzeButtonProps> = ({ onReanalyze }) => {
  return (
    <div className="flex justify-end">
      <button 
        onClick={onReanalyze}
        className="text-sm text-primary hover:underline flex items-center gap-1"
      >
        <Loader2 className="h-3 w-3" />
        Analisar novamente
      </button>
    </div>
  );
};

export default ReanalyzeButton;
