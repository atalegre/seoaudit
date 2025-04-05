
import React from 'react';
import { AlertTriangle, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AlertBannerProps {
  condition: boolean;
  message: string;
  type: 'warning' | 'success';
}

const AlertBanner: React.FC<AlertBannerProps> = ({ condition, message, type }) => {
  if (!condition && type === 'warning') return null;
  if (condition && type === 'warning') {
    return (
      <Alert variant="warning" className="mt-3">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {message}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (condition && type === 'success') {
    return (
      <Alert variant="success" className="mt-3 bg-green-50 border-green-200 text-green-800">
        <Check className="h-4 w-4 text-green-600" />
        <AlertDescription>
          {message}
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};

export default AlertBanner;
