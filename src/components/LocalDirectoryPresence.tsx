
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDirectoryPresence } from './local-directory/use-directory-presence';
import { FoundPresence } from './local-directory/found-presence';
import { NotFoundPresence } from './local-directory/not-found-presence';
import { DirectoryPresenceProps } from './local-directory/types';

export const LocalDirectoryPresence: React.FC<DirectoryPresenceProps> = ({ 
  url, 
  companyName 
}) => {
  const { loading, paiPresence } = useDirectoryPresence({ url, companyName });
  const isMobile = useIsMobile();
  
  return (
    <Card>
      <CardHeader className={isMobile ? "px-4 py-3" : ""}>
        <CardTitle className="flex items-center gap-2">
          <span>Presença em Diretórios Locais</span>
        </CardTitle>
      </CardHeader>
      <CardContent className={isMobile ? "px-4 py-2" : ""}>
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2">Verificando presença em diretórios...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 font-medium mb-3">
                <span className="text-base">🗂️ PAI.pt</span>
              </div>
              
              {paiPresence?.found ? (
                <FoundPresence presence={paiPresence} />
              ) : (
                <NotFoundPresence />
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocalDirectoryPresence;
