
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useAnalyzerRedirect = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleAnalyzeAndRedirect = (url: string) => {
    if (!url) {
      toast.error("Por favor, insira um URL válido");
      return;
    }

    setIsAnalyzing(true);
    toast.info("Analisando site...", {
      description: "Este processo pode demorar alguns segundos."
    });

    // Store the URL for later use
    localStorage.setItem('lastAnalyzedUrl', url);

    // Simulate analysis (would connect to your API in production)
    setTimeout(() => {
      setIsAnalyzing(false);
      
      // Extract domain for project ID creation
      const domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
      const projectId = `${domain}-${Date.now()}`.replace(/[^a-zA-Z0-9]/g, '-');
      
      // Check if we're in development or production environment
      const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname.includes('lovable');
      
      if (isDevelopment) {
        // For development environment - redirect to local route
        navigate(`/suite?url=${encodeURIComponent(url)}`);
      } else {
        // For production - redirect to the subdomain in a new tab
        const suiteUrl = `https://suite.seoaudit.pt/projeto/${projectId}?url=${encodeURIComponent(url)}`;
        window.open(suiteUrl, '_blank');
      }
    }, 2000);
  };

  return {
    isAnalyzing,
    handleAnalyzeAndRedirect
  };
};

export default useAnalyzerRedirect;
