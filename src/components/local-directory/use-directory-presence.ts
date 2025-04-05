
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
        
        // Encontrar empresa no diretório com correspondência exata do domínio
        const foundListing = findCompanyInDirectory(domain);
        
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

  // Função auxiliar para encontrar empresas no diretório por domínio
  const findCompanyInDirectory = (domain: string) => {
    if (!domain) return null;
    
    // Log para debug
    console.log("Buscando domínio exato:", domain);
    console.log("Domínios disponíveis:", PAI_DIRECTORY.map(item => item.domains).flat());
    
    // Primeiro tenta encontrar correspondência exata
    const exactMatch = PAI_DIRECTORY.find(listing => 
      listing.domains.some(listingDomain => 
        listingDomain.toLowerCase() === domain.toLowerCase()
      )
    );
    
    if (exactMatch) {
      console.log("Encontrada correspondência exata para:", domain);
      return exactMatch;
    }
    
    // Se não houver correspondência exata, tenta correspondência similar
    console.log("Tentando correspondência similar para:", domain);
    return PAI_DIRECTORY.find(listing => 
      listing.domains.some(listingDomain => 
        areDomainsRelated(domain, listingDomain)
      )
    );
  };

  return { loading, paiPresence };
};
