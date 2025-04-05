
import { useState, useEffect } from 'react';
import { DirectoryPresenceProps, DirectoryPresenceResult } from './types';
import { PAI_DIRECTORY } from './directory-data';
import { 
  extractDomainFromUrl, 
  areDomainsRelated,
  areCompanyNamesSimilar,
  normalizeDomain
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
        
        // Normalizar o domínio para melhorar a comparação
        const normalizedDomain = normalizeDomain(domain);
        console.log("Domínio normalizado para busca:", normalizedDomain);
        
        // Encontrar empresa no diretório com qualquer tipo de correspondência
        const foundListing = findCompanyInDirectory(normalizedDomain);
        
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
          console.log("Nenhuma listagem PAI encontrada para o domínio:", normalizedDomain);
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
    
    const normalizedInput = normalizeDomain(domain);
    
    // Log para debug
    console.log("Buscando domínio normalizado:", normalizedInput);
    
    // Matriz de todos os domínios normalizados para comparação
    const allDomains = PAI_DIRECTORY.map(item => ({
      listing: item,
      domains: item.domains.map(d => normalizeDomain(d))
    }));
    
    console.log("Todos os domínios normalizados:", allDomains.map(item => item.domains).flat());
    
    // Primeiro tenta encontrar correspondência exata
    const exactMatch = PAI_DIRECTORY.find(listing => 
      listing.domains.some(listingDomain => 
        normalizeDomain(listingDomain) === normalizedInput
      )
    );
    
    if (exactMatch) {
      console.log("Encontrada correspondência exata para:", normalizedInput);
      return exactMatch;
    }
    
    // Verifica se o domínio de entrada está contido em algum dos domínios do diretório
    // ou se algum domínio do diretório está contido no domínio de entrada
    const partialMatch = PAI_DIRECTORY.find(listing => 
      listing.domains.some(listingDomain => {
        const normalizedListingDomain = normalizeDomain(listingDomain);
        return normalizedInput.includes(normalizedListingDomain) || 
               normalizedListingDomain.includes(normalizedInput);
      })
    );
    
    if (partialMatch) {
      console.log("Encontrada correspondência parcial para:", normalizedInput);
      return partialMatch;
    }
    
    // Se não houver correspondência exata ou parcial, tenta correspondência similar
    console.log("Tentando correspondência de similaridade para:", normalizedInput);
    return PAI_DIRECTORY.find(listing => 
      listing.domains.some(listingDomain => 
        areDomainsRelated(domain, listingDomain)
      )
    );
  };

  return { loading, paiPresence };
};
