
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

  // Normalize URL function
  const normalizeUrl = (inputUrl: string) => {
    // Remove any whitespace
    let cleanUrl = inputUrl.trim();
    
    // If no protocol, add https://
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    
    // Remove www. if present
    cleanUrl = cleanUrl.replace(/^https?:\/\/www\./, 'https://');
    
    return cleanUrl;
  };

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
      // Normalize the URL param before setting
      const normalizedUrl = normalizeUrl(urlParam);
      setUrl(normalizedUrl);
      localStorage.setItem('lastAnalyzedUrl', normalizedUrl);
      
      toast.success(`Site analisado: ${normalizedUrl}`, {
        description: "Os resultados estão disponíveis no dashboard."
      });
    }
  }, [urlParam]);

  // Custom setUrl that normalizes the input
  const setNormalizedUrl = (inputUrl: string) => {
    const normalizedUrl = normalizeUrl(inputUrl);
    setUrl(normalizedUrl);
  };

  return {
    url,
    setUrl: setNormalizedUrl,
    domain,
    setDomain,
    analyzeDomain,
    setAnalyzeDomain,
    lastAnalysisDate,
    setLastAnalysisDate
  };
}
