
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { formatDomainFromUrl } from '@/utils/domainUtils';

/**
 * Hook to manage URL state and related functionality
 */
export function useUrlState() {
  const [searchParams] = useSearchParams();
  const urlParam = searchParams.get('url');
  const storedUrl = localStorage.getItem('lastAnalyzedUrl');
  
  const [url, setUrl] = useState<string>(urlParam || storedUrl || '');
  const [domain, setDomain] = useState<string>('');
  const [analyzeDomain, setAnalyzeDomain] = useState<string>('');
  const [lastAnalysisDate, setLastAnalysisDate] = useState<string>(new Date().toLocaleDateString('pt-PT'));

  // Update domain when URL changes
  useEffect(() => {
    if (url) {
      const formattedDomain = formatDomainFromUrl(url);
      setDomain(formattedDomain);
      
      // Store URL in localStorage
      localStorage.setItem('lastAnalyzedUrl', url);
      
      // Set last analysis date
      setLastAnalysisDate(new Date().toLocaleDateString('pt-PT'));
    }
  }, [url]);

  // Initialize from URL parameters
  useEffect(() => {
    if (urlParam && urlParam !== url) {
      setUrl(urlParam);
      localStorage.setItem('lastAnalyzedUrl', urlParam);
      
      toast.success(`Site analisado: ${urlParam}`, {
        description: "Os resultados estão disponíveis no dashboard."
      });
    }
  }, [urlParam]);

  return {
    url,
    setUrl,
    domain,
    setDomain,
    analyzeDomain,
    setAnalyzeDomain,
    lastAnalysisDate,
    setLastAnalysisDate
  };
}
