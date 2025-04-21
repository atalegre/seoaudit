
import React from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { safeGet } from '@/utils/dataChecks';

interface SecurityData {
  https?: boolean;
  mixedContent?: boolean;
}

interface MobileSecuritySectionProps {
  data?: {
    mobileFriendly?: boolean;
    security?: SecurityData;
  };
  mobileFriendly?: boolean;
  security?: {
    https?: boolean;
    mixedContent?: boolean;
  };
  className?: string;
}

const MobileSecuritySection = ({ data, mobileFriendly, security, className }: MobileSecuritySectionProps) => {
  // Support both direct props and data object for backward compatibility
  const isMobileFriendly = mobileFriendly ?? data?.mobileFriendly ?? false;
  const isHttps = security?.https ?? data?.security?.https ?? false;
  const hasMixedContent = security?.mixedContent ?? data?.security?.mixedContent ?? false;
  
  return (
    <div className={className}>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Shield className="h-5 w-5 text-blue-500" />
        Compatibilidade Mobile e Segurança
      </h2>
      
      <div className="space-y-4">
        {/* Mobile Friendliness */}
        <div className="p-4 bg-white rounded-lg border">
          <div className="flex items-start gap-2">
            {isMobileFriendly ? (
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
            )}
            <div>
              <h3 className="text-sm font-medium mb-1">Compatibilidade com Dispositivos Móveis</h3>
              <p className="text-sm text-gray-600 mb-2">
                {isMobileFriendly 
                  ? "O site está otimizado para dispositivos móveis." 
                  : "O site não está otimizado para dispositivos móveis."}
              </p>
              <Progress 
                value={isMobileFriendly ? 100 : 30} 
                className="h-2" 
                indicatorClassName={isMobileFriendly ? "bg-green-500" : "bg-red-500"}
              />
            </div>
          </div>
          
          {!isMobileFriendly && (
            <Alert variant="destructive" className="mt-3">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Sites não otimizados para dispositivos móveis são penalizados no ranking do Google. Considere implementar um design responsivo.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        {/* HTTPS Security */}
        <div className="p-4 bg-white rounded-lg border">
          <div className="flex items-start gap-2">
            {isHttps ? (
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
            )}
            <div>
              <h3 className="text-sm font-medium mb-1">Segurança HTTPS</h3>
              <p className="text-sm text-gray-600 mb-2">
                {isHttps 
                  ? "O site está utilizando conexão segura HTTPS." 
                  : "O site não está utilizando conexão segura HTTPS."}
              </p>
              <Progress 
                value={isHttps ? 100 : 30} 
                className="h-2" 
                indicatorClassName={isHttps ? "bg-green-500" : "bg-red-500"}
              />
            </div>
          </div>
          
          {!isHttps && (
            <Alert variant="destructive" className="mt-3">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Sites sem HTTPS são marcados como inseguros pelos navegadores e podem perder posições no ranking.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        {/* Mixed Content Warning */}
        {isHttps && hasMixedContent && (
          <div className="p-4 bg-white rounded-lg border">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium mb-1">Conteúdo Misto Detectado</h3>
                <p className="text-sm text-gray-600">
                  O site tem HTTPS, mas carrega alguns recursos via HTTP inseguro. Isso pode gerar alertas de segurança nos navegadores.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileSecuritySection;
