
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';

export const useAnalyzerRedirect = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  const normalizeUrl = (inputUrl: string) => {
    // Remove any whitespace
    let formattedUrl = inputUrl.trim();
    
    // If no protocol, add https://
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    // Remove www. if present (optional, based on your requirements)
    formattedUrl = formattedUrl.replace(/^https?:\/\/www\./, 'https://');
    
    return formattedUrl;
  };

  const handleAnalyzeAndRedirect = (url: string) => {
    if (!url) {
      toast.error("Por favor, insira um URL válido");
      return;
    }

    // Normalize URL 
    const formattedUrl = normalizeUrl(url);
    
    // Store URL for later use
    localStorage.setItem('lastAnalyzedUrl', formattedUrl);
    
    setIsAnalyzing(true);
    toast.info("Analisando site...", {
      description: "Este processo pode demorar alguns segundos."
    });
    
    // Set flag for first time visit to dashboard
    const hasVisitedDashboard = localStorage.getItem('hasVisitedDashboard');
    if (!hasVisitedDashboard) {
      localStorage.setItem('showOnboardingTour', 'true');
    }

    // Extract domain for project ID creation
    const domain = formattedUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    const projectId = `${domain}-${Date.now()}`.replace(/[^a-zA-Z0-9]/g, '-');
    
    // FIXED: Always redirect to local route - we'll handle subdomain distinction in the app
    // This ensures consistent routing behavior regardless of environment
    navigate(`/suite?url=${encodeURIComponent(formattedUrl)}&projectId=${projectId}`);
    
    // Mark that user has visited dashboard
    localStorage.setItem('hasVisitedDashboard', 'true');
    
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  return {
    isAnalyzing,
    handleAnalyzeAndRedirect
  };
};

export default useAnalyzerRedirect;
