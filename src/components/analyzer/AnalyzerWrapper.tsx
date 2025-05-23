
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// This is a wrapper component that can be used to modify MainAnalyzer's behavior
// without editing the original component
const AnalyzerWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  // Check if we need to add our listener when the component mounts
  React.useEffect(() => {
    // Add a custom event listener for form submissions
    const handleAnalysisSubmit = (event: CustomEvent) => {
      // Get the URL from the event detail
      const url = event.detail?.url;
      
      if (url) {
        // Store the URL in localStorage
        localStorage.setItem('lastAnalyzedUrl', url);
        
        // Extract domain for project ID creation
        const domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
        const projectId = `${domain}-${Date.now()}`.replace(/[^a-zA-Z0-9]/g, '-');
        
        // Redirect to the suite with this URL - always use local routing
        navigate(`/suite?url=${encodeURIComponent(url)}&projectId=${projectId}`);
        
        // Show a notification
        toast.success("Análise iniciada", {
          description: "Redirecionando para o dashboard..."
        });
      }
    };

    // Register the custom event listener
    window.addEventListener('seoaudit:analyze', handleAnalysisSubmit as EventListener);
    
    // Clean up the listener when component unmounts
    return () => {
      window.removeEventListener('seoaudit:analyze', handleAnalysisSubmit as EventListener);
    };
  }, [navigate]);

  return <>{children}</>;
};

export default AnalyzerWrapper;
