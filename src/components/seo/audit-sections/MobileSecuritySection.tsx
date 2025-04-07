
import React from 'react';
import { Shield, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileSecuritySectionProps {
  mobileFriendly: boolean;
  security: {
    https: boolean;
    mixedContent: boolean;
  };
}

const MobileSecuritySection = ({ mobileFriendly, security }: MobileSecuritySectionProps) => {
  return (
    <div>
      <h3 className="font-medium flex items-center gap-2 mb-3">
        <Shield className="h-4 w-4 text-blue-600" />
        Mobile & Security
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">Mobile Friendly</span>
          <div className={cn(
            "flex items-center gap-1",
            mobileFriendly ? "text-green-600" : "text-red-600"
          )}>
            {mobileFriendly ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Sim</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Não</span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">HTTPS</span>
          <div className={cn(
            "flex items-center gap-1",
            security.https ? "text-green-600" : "text-red-600"
          )}>
            {security.https ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Sim</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Não</span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">Conteúdo Misto</span>
          <div className={cn(
            "flex items-center gap-1",
            !security.mixedContent ? "text-green-600" : "text-red-600"
          )}>
            {!security.mixedContent ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Não detectado</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Detectado</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSecuritySection;
