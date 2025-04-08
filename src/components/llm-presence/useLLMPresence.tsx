
import { useState, useEffect } from 'react';
import { LLMReport, ModelPresence } from './types';
import { generateMockReport } from './utils';
import { extractDomainFromUrl } from '@/utils/domainUtils';

interface UseLLMPresenceProps {
  url: string;
  autoStart?: boolean;
}

export const useLLMPresence = ({ url, autoStart = false }: UseLLMPresenceProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [presenceScore, setPresenceScore] = useState<number | null>(null);
  const [report, setReport] = useState<LLMReport | null>(null);
  const [domain, setDomain] = useState<string>('');
  const [modelPresence, setModelPresence] = useState<ModelPresence[]>([]);

  const handleCheckPresence = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Extract domain from URL
      const extractedDomain = extractDomainFromUrl(url);
      setDomain(extractedDomain || '');
      
      // In a real implementation, this would be an API call to analyze LLM presence
      // For now, using mock data
      setTimeout(() => {
        const mockReport = generateMockReport(extractedDomain || '');
        setReport(mockReport);
        setPresenceScore(mockReport.score);
        setModelPresence(mockReport.models);
        setLoading(false);
      }, 2000);
      
    } catch (err) {
      console.error('Error checking LLM presence:', err);
      setError('Failed to check LLM presence');
      setLoading(false);
    }
  };
  
  // Auto-start the analysis if needed
  useEffect(() => {
    if (autoStart && url) {
      handleCheckPresence();
    }
  }, [autoStart, url]);
  
  return {
    loading,
    error,
    presenceScore,
    report,
    domain,
    modelPresence,
    handleCheckPresence
  };
};
