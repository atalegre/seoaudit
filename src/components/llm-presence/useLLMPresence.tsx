
import { useState, useEffect } from 'react';
import { extractDomainFromUrl, generateConsistentScore, generateConsistentReport } from './utils';
import { LLMPresenceReport, ModelPresence } from './types';

interface UseLLMPresenceProps {
  url?: string;
  autoStart?: boolean;
}

export const useLLMPresence = ({ url = "", autoStart = false }: UseLLMPresenceProps) => {
  const [domain, setDomain] = useState("");
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [presenceScore, setPresenceScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDomainMentioned, setIsDomainMentioned] = useState(false);
  const [modelPresence, setModelPresence] = useState<ModelPresence[]>([]);

  useEffect(() => {
    if (url && autoStart) {
      const extractedDomain = extractDomainFromUrl(url);
      if (extractedDomain) {
        setDomain(extractedDomain);
        handleCheckPresence();
      }
    }
  }, [url, autoStart]);

  const handleCheckPresence = async () => {
    if (!domain && !url) return;
    
    setLoading(true);
    setError(null);
    
    const domainToUse = domain || extractDomainFromUrl(url);
    
    // Generate consistent score for the domain
    const domainScore = generateConsistentScore(domainToUse);
    const domainReport = generateConsistentReport(domainToUse, domainScore);
    
    // Generate model-specific scores
    const models = [
      { name: 'ChatGPT', score: Math.min(domainScore + 15, 100)},
      { name: 'Gemini', score: Math.max(Math.floor(domainScore * 0.65), 0)},
      { name: 'Perplexity', score: Math.max(Math.floor(domainScore * 0.4), 0)},
      { name: 'Claude', score: Math.max(Math.floor(domainScore * 0.3), 0)},
      { name: 'Bing Copilot', score: Math.max(Math.floor(domainScore * 0.2), 0)}
    ];
    
    // Simulate processing time
    setTimeout(() => {
      setReport(domainReport);
      setPresenceScore(domainScore);
      setIsDomainMentioned(domainScore > 50);
      setModelPresence(models);
      setLoading(false);
    }, 1500);
  };

  const result: LLMPresenceReport = {
    domain,
    score: presenceScore || 0,
    report,
    isDomainMentioned: isDomainMentioned,
    modelPresence: modelPresence
  };

  return {
    loading,
    error,
    presenceScore,
    report,
    domain,
    modelPresence,
    result,
    handleCheckPresence
  };
};
