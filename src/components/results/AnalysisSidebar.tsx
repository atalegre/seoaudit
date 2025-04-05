
import React, { Suspense, lazy } from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { extractDomainFromUrl } from '@/utils/domainUtils';

// Lazy loaded components para melhorar performance
const LLMPresenceAudit = lazy(() => import('@/components/LLMPresenceAudit'));
const LocalDirectoryPresence = lazy(() => import('@/components/LocalDirectoryPresence'));

interface AnalysisSidebarProps {
  url: string;
  seoScore: number;
  aioScore: number;
}

const AnalysisSidebar: React.FC<AnalysisSidebarProps> = ({ 
  url, 
  seoScore,
  aioScore 
}) => {
  // Extrair nome da empresa do domínio para diretório local
  const domain = extractDomainFromUrl(url);
  const companyName = domain?.split('.')[0] || '';
  
  return (
    <div className="space-y-6">
      <Card className="p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Verificações adicionais</h3>
        <Separator className="my-3" />
        
        <div className="space-y-6">
          <Suspense fallback={<div className="h-32 flex items-center justify-center">Carregando verificação LLM...</div>}>
            <LLMPresenceAudit url={url} autoStart={true} />
          </Suspense>
          
          <Separator className="my-3" />
          
          <Suspense fallback={<div className="h-32 flex items-center justify-center">Carregando verificação PAI.pt...</div>}>
            <LocalDirectoryPresence url={url} companyName={companyName} />
          </Suspense>
        </div>
      </Card>
    </div>
  );
};

export default AnalysisSidebar;

