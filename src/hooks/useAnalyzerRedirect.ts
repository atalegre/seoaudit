
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';

export const useAnalyzerRedirect = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  const handleAnalyzeAndRedirect = (url: string) => {
    if (!url) {
      toast.error("Por favor, insira um URL válido");
      return;
    }

    // Normalize URL if needed
    let formattedUrl = url;
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

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
    
    // Check if we're in development or production environment
    const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname.includes('lovable');
    
    if (isDevelopment) {
      // For development environment - redirect to local route
      navigate(`/suite?url=${encodeURIComponent(formattedUrl)}&projectId=${projectId}`);
    } else {
      // For production - direct to the suite subdomain
      window.location.href = `https://suite.seoaudit.pt/projeto/${projectId}?url=${encodeURIComponent(formattedUrl)}`;
    }
    
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
