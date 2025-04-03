
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ResendButtonProps {
  onResend: () => void;
  isResending: boolean;
}

const ResendButton = ({ onResend, isResending }: ResendButtonProps) => {
  return (
    <Button 
      variant="default" 
      className="w-full"
      onClick={onResend}
      disabled={isResending}
    >
      {isResending ? (
        <>
          <RefreshCw className="h-4 w-4 animate-spin mr-2" /> A reenviar...
        </>
      ) : (
        <>Reenviar email de verificação</>
      )}
    </Button>
  );
};

export default ResendButton;
