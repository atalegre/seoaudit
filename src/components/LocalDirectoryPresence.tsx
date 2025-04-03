
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Check, X, Info, Link } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface LocalDirectoryPresenceProps {
  url: string;
  companyName?: string;
}

export const LocalDirectoryPresence: React.FC<LocalDirectoryPresenceProps> = ({ 
  url, 
  companyName 
}) => {
  const [loading, setLoading] = useState(true);
  const [paiPresence, setPaiPresence] = useState<{
    found: boolean;
    name?: string;
    phone?: string;
    url?: string;
    paiUrl?: string;
    nameMatch?: boolean;
    phoneMatch?: boolean;
    urlMatch?: boolean;
  } | null>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // In a real implementation, this would call an API to check PAI.pt presence
    // For now, we'll simulate the data based on the URL
    const checkPaiPresence = async () => {
      setLoading(true);
      
      try {
        // Simulate API call with a timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data based on the URL for demonstration
        const domain = url.replace(/^https?:\/\//, '').split('/')[0];
        const normalizedDomain = domain.toLowerCase();
        
        if (normalizedDomain.includes('futuria.pt')) {
          setPaiPresence({
            found: true,
            name: "Futuria",
            phone: "800 200 300",
            url: "www.futuria.pt",
            paiUrl: "https://pai.pt/p/futuria",
            nameMatch: true,
            phoneMatch: true,
            urlMatch: true
          });
        } else if (normalizedDomain.includes('coolingrent.pt')) {
          setPaiPresence({
            found: true,
            name: "Cooling Rent",
            phone: "218 248 200",
            url: "www.coolingrent.pt",
            paiUrl: "https://pai.pt/p/cooling-rent",
            nameMatch: true,
            phoneMatch: true,
            urlMatch: true
          });
        } else if (normalizedDomain.includes('viata.pt')) {
          setPaiPresence({
            found: true,
            name: "Viata",
            phone: "211 451 489",
            url: "www.viata.pt",
            paiUrl: "https://pai.pt/p/viata",
            nameMatch: true,
            phoneMatch: true,
            urlMatch: true
          });
        } else {
          setPaiPresence({
            found: false
          });
        }
      } catch (error) {
        console.error('Error checking PAI presence:', error);
        setPaiPresence(null);
      } finally {
        setLoading(false);
      }
    };
    
    if (url) {
      checkPaiPresence();
    }
  }, [url]);
  
  const renderStatusIcon = (status?: boolean) => {
    if (status === undefined) return null;
    
    return status ? 
      <Check className="h-4 w-4 text-green-500" /> : 
      <AlertCircle className="h-4 w-4 text-amber-500" />;
  };
  
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
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-green-500">
                      <Check className="h-3 w-3 mr-1" /> Empresa encontrada
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">🔹 Nome:</span>
                      <span className="font-medium">{paiPresence.name}</span>
                      {renderStatusIcon(paiPresence.nameMatch)}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">🔹 Telefone:</span>
                      <span className="font-medium">{paiPresence.phone}</span>
                      {renderStatusIcon(paiPresence.phoneMatch)}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">🔹 URL:</span>
                      <span className="font-medium">{paiPresence.url}</span>
                      {renderStatusIcon(paiPresence.urlMatch)}
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => window.open(paiPresence.paiUrl, '_blank')}
                  >
                    <Link className="h-3 w-3 mr-1" /> Ver ficha no PAI.pt
                  </Button>
                  
                  <Alert className="mt-4 bg-green-50">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      A sua empresa está listada corretamente no PAI.pt – ótimo para SEO local e confiança.
                    </AlertDescription>
                  </Alert>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="destructive">
                      <X className="h-3 w-3 mr-1" /> Empresa não encontrada
                    </Badge>
                  </div>
                  
                  <Alert className="bg-amber-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      A sua empresa não foi encontrada no PAI.pt. Recomendamos que a adicione para melhorar visibilidade local e confiança digital.
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocalDirectoryPresence;
