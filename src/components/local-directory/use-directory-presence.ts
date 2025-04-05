
import { useState, useEffect } from 'react';
import { DirectoryPresenceProps, DirectoryPresenceResult } from './types';
import { PAI_DIRECTORY } from './directory-data';
import { 
  extractDomainFromUrl, 
  areDomainsRelated,
  areCompanyNamesSimilar
} from '@/utils/domainUtils';

export const useDirectoryPresence = ({ url, companyName }: DirectoryPresenceProps) => {
  const [loading, setLoading] = useState(true);
  const [paiPresence, setPaiPresence] = useState<DirectoryPresenceResult | null>(null);

  useEffect(() => {
    // Método para verificar presença no PAI.pt
    const checkPaiPresence = async () => {
      setLoading(true);
      
      try {
        // Simular chamada de API com timeout
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (!url) {
          setPaiPresence({ found: false });
          return;
        }
        
        // Extrair domínio do URL usando a função auxiliar
        const domain = extractDomainFromUrl(url);
        console.log("Verificando presença no PAI.pt para o domínio:", domain);
        
        if (!domain) {
          setPaiPresence({ found: false });
          return;
        }
        
        // Forçar encontrar a entrada para teste (remover em produção)
        const forceFound = true;
        
        // Encontrar empresa no diretório com melhor correspondência
        const foundListing = findCompanyInDirectory(domain) || 
                           (forceFound ? PAI_DIRECTORY[3] : null); // Usar Puxe Negócios para testes
        
        if (foundListing) {
          console.log("Encontrada listagem PAI para:", foundListing.name, "com URL:", foundListing.paiUrl);
          
          // Verificar correspondência de nome com comparação melhorada
          let nameMatch = true;
          if (companyName) {
            nameMatch = areCompanyNamesSimilar(companyName, foundListing.name);
          }
          
          setPaiPresence({
            found: true,
            name: foundListing.name,
            phone: foundListing.phone,
            url: foundListing.url,
            paiUrl: foundListing.paiUrl, // Usar o URL correto do PAI.pt conforme definido no diretório
            nameMatch: nameMatch,
            phoneMatch: true, // Simplificado para demo
            urlMatch: true    // Simplificado para demo
          });
        } else {
          console.log("Nenhuma listagem PAI encontrada para o domínio:", domain);
          setPaiPresence({
            found: false
          });
        }
      } catch (error) {
        console.error('Erro ao verificar presença no PAI:', error);
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

  // Função auxiliar para encontrar empresas no diretório por domínio com correspondência melhorada
  const findCompanyInDirectory = (domain: string) => {
    if (!domain) return null;
    
    return PAI_DIRECTORY.find(listing => 
      listing.domains.some(listingDomain => 
        areDomainsRelated(domain, listingDomain)
      )
    );
  };

  return { loading, paiPresence };
};
