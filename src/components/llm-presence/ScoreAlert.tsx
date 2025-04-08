
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { getScoreColorClass, getAlertMessage } from './utils';

interface ScoreAlertProps {
  score: number;
}

const ScoreAlert: React.FC<ScoreAlertProps> = ({ score }) => {
  let icon = <AlertTriangle className="h-4 w-4" />;
  let variant: "default" | "destructive" | "warning" | "success" | null = "warning";
  
  if (score >= 70) {
    icon = <CheckCircle className="h-4 w-4" />;
    variant = "success";
  } else if (score >= 40) {
    icon = <Info className="h-4 w-4" />;
    variant = "default";
  }
  
  return (
    <Alert variant={variant} className="mb-4">
      {icon}
      <AlertDescription>
        {getAlertMessage(score)}
      </AlertDescription>
    </Alert>
  );
};

export default ScoreAlert;
