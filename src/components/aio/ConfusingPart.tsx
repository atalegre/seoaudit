
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ConfusingPartProps {
  text: string;
}

const ConfusingPart: React.FC<ConfusingPartProps> = ({ text }) => {
  return (
    <div className="flex items-start gap-2 p-2 rounded-md bg-red-50 border border-red-100 mb-2">
      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
      <p className="text-xs text-red-800">{text}</p>
    </div>
  );
};

export default ConfusingPart;
