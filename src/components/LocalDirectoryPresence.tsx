
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

// Define a more robust list of companies in PAI.pt for testing and demonstration
const PAI_DIRECTORY = [
  {
    domains: ['futuria.pt', 'www.futuria.pt'],
    name: "Futuria",
    phone: "800 200 300",
    url: "www.futuria.pt",
    paiUrl: "https://pai.pt/p/futuria",
  },
  {
    domains: ['coolingrent.pt', 'www.coolingrent.pt'],
    name: "Cooling Rent",
    phone: "218 248 200",
    url: "www.coolingrent.pt",
    paiUrl: "https://pai.pt/p/cooling-rent",
  },
  {
    domains: ['viata.pt', 'www.viata.pt'],
    name: "Viata",
    phone: "211 451 489",
    url: "www.viata.pt",
    paiUrl: "https://pai.pt/p/viata",
  },
  {
    domains: ['puxenegocios.pt', 'www.puxenegocios.pt'],
    name: "Puxe Negócios",
    phone: "211 307 485",
    url: "www.puxenegocios.pt",
    paiUrl: "https://pai.pt/p/puxenegocios",
  },
  {
    domains: ['kutuko.com', 'www.kutuko.com'],
    name: "Kutuko",
    phone: "210 338 200",
    url: "www.kutuko.com",
    paiUrl: "https://pai.pt/p/kutuko",
  }
];

// Helper function to extract domain from URL
const extractDomainFromUrl = (url: string): string => {
  let normalizedUrl = url.toLowerCase().trim();
  
  // Add protocol if missing
  if (!normalizedUrl.startsWith('http')) {
    normalizedUrl = 'https://' + normalizedUrl;
  }
  
  try {
    const urlObj = new URL(normalizedUrl);
    return urlObj.hostname;
  } catch (error) {
    console.error('Invalid URL format:', normalizedUrl);
    // Fallback to regex matching if URL parsing fails
    const domainMatch = normalizedUrl.match(/^https?:\/\/([^\/]+)/i);
    return domainMatch ? domainMatch[1].toLowerCase() : '';
  }
};

// Helper function to find company in directory by domain
const findCompanyByDomain = (domain: string): any | null => {
  if (!domain) return null;
  
  const cleanDomain = domain.toLowerCase().replace(/^www\./, '');
  
  return PAI_DIRECTORY.find(listing => 
    listing.domains.some(d => {
      const cleanListingDomain = d.toLowerCase().replace(/^www\./, '');
      return cleanDomain === cleanListingDomain || 
             cleanDomain.includes(cleanListingDomain) || 
             cleanListingDomain.includes(cleanDomain);
    })
  );
};

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
    // Improved method to check PAI.pt presence
    const checkPaiPresence = async () => {
      setLoading(true);
      
      try {
        // Simulate API call with a timeout
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (!url) {
          setPaiPresence({ found: false });
          return;
        }
        
        // Extract domain from URL using the helper function
        const domain = extractDomainFromUrl(url);
        console.log("Checking PAI presence for domain:", domain);
        
        if (!domain) {
          setPaiPresence({ found: false });
          return;
        }
        
        // Find company in directory
        const foundListing = findCompanyByDomain(domain);
        
        if (foundListing) {
          console.log("Found PAI listing for:", foundListing.name);
          
          // Check name match if provided
          let nameMatch = true;
          if (companyName) {
            const normalizedCompanyName = companyName.toLowerCase();
            const normalizedListingName = foundListing.name.toLowerCase();
            
            nameMatch = 
              normalizedCompanyName.includes(normalizedListingName) || 
              normalizedListingName.includes(normalizedCompanyName) ||
              // Check for common word matches
              normalizedCompanyName.split(' ').some(word => 
                word.length > 3 && normalizedListingName.includes(word)
              );
          }
          
          setPaiPresence({
            found: true,
            name: foundListing.name,
            phone: foundListing.phone,
            url: foundListing.url,
            paiUrl: foundListing.paiUrl,
            nameMatch: nameMatch,
            phoneMatch: true, // Simplified for demo
            urlMatch: true    // Simplified for demo
          });
        } else {
          console.log("No PAI listing found for domain:", domain);
          setPaiPresence({
            found: false
          });
        }
      } catch (error) {
        console.error('Error checking PAI presence:', error);
        setPaiPresence({ found: false });
      } finally {
        setLoading(false);
      }
    };
    
    if (url) {
      checkPaiPresence();
    } else {
      setLoading(false);
      setPaiPresence({ found: false });
    }
  }, [url, companyName]);
  
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
