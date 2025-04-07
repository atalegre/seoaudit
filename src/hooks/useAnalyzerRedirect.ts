
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
      
      // Redirect to suite dashboard with the URL
      navigate(`/suite?url=${encodeURIComponent(url)}`);
    }, 2000);
  };

  return {
    isAnalyzing,
    handleAnalyzeAndRedirect
  };
};

export default useAnalyzerRedirect;
