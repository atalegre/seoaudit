
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import DomainHeader from './DomainHeader';
import ScoreCards from './ScoreCards';
import { useUser } from '@/contexts/UserContext';
import HistoryTabs from './HistoryTabs';
import AvailableTools from './AvailableTools';
import FirstTimeExperience from './FirstTimeExperience';
import EmptyDashboardState from './EmptyDashboardState';
import DashboardMetrics from './DashboardMetrics';
import RecommendationsSection from './RecommendationsSection';
import { useDashboardState } from '@/hooks/suite/useDashboardState';
import { useUrlState } from '@/hooks/suite/dashboard/useUrlState';
import LoginDialog from '@/components/auth/LoginDialog';
import DashboardRecommendations from './DashboardRecommendations';
import { useNavigate as useNavigateHook } from 'react-router-dom';

const DashboardContent = () => {
  const { url, setUrl, domain, lastAnalysisDate } = useUrlState();
  const dashboardState = useDashboardState(url);
  const [urlInput, setUrlInput] = useState(url || '');
  const { user } = useUser();
  const navigate = useNavigate();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!urlInput.trim()) {
      toast.error('Por favor, digite uma URL para analisar');
      return;
    }
    
    // Simplistic validation
    if (!urlInput.includes('.') || urlInput.length < 4) {
      toast.error('Por favor, digite uma URL válida');
      return;
    }
    
    // If user is not logged in, we want to capture this URL for after login
    if (!user) {
      sessionStorage.setItem('pendingAnalysisUrl', urlInput);
      setShowLoginDialog(true);
      return;
    }
    
    // Get a clean version of the URL
    let cleanUrl = urlInput.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    
    setUrl(cleanUrl);
    toast.info(`Analisando ${cleanUrl}...`);
  };
  
  const handleStartAnalysis = () => {
    // If there's no user, show login dialog
    if (!user) {
      setShowLoginDialog(true);
      return;
    }
    
    // Otherwise, scroll to input or focus it
    const inputElement = document.getElementById('url-input');
    if (inputElement) {
      inputElement.focus();
      inputElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };
  
  const handleViewMoreRecommendations = () => {
    if (!user) {
      toast.error("Login necessário", {
        description: "Faça login para ver todas as recomendações detalhadas."
      });
      return;
    }
    
    navigate('/suite/recommendations');
  };
  
  return (
    <div className="space-y-6">
      {/* URL Input form */}
      <form onSubmit={handleUrlSubmit} className="mx-auto max-w-2xl mb-8">
        <div className="flex space-x-2">
          <Input
            id="url-input"
            type="text"
            placeholder="Digite o URL do seu website"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={dashboardState.isLoading}>
            {dashboardState.isLoading ? (
              'Analisando...'
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analisar
              </>
            )}
          </Button>
        </div>
      </form>
      
      {!url && !dashboardState.isLoading && (
        // First time / empty state
        user ? <AvailableTools /> : <FirstTimeExperience onStartAnalysis={handleStartAnalysis} />
      )}
      
      {url && !dashboardState.isLoading && (
        <>
          <DomainHeader 
            domain={domain}
            logoUrl={dashboardState.logoUrl}
          />
          
          <HistoryTabs 
            isUserLoggedIn={!!user}
          />
          
          <ScoreCards 
            seoScore={dashboardState.seoScore} 
            aioScore={dashboardState.aioScore}
            navigateTo={navigateTo}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardMetrics />
            <DashboardRecommendations 
              recommendations={dashboardState.recommendations} 
              isUserLoggedIn={!!user}
              navigateTo={navigateTo}
              onViewMoreRecommendations={handleViewMoreRecommendations}
            />
          </div>
          
          <RecommendationsSection 
            recommendations={dashboardState.recommendations}
            onViewMore={handleViewMoreRecommendations}
          />
        </>
      )}
      
      {url && !dashboardState.isLoading && dashboardState.isEmpty && (
        <EmptyDashboardState 
          analyzeDomain={urlInput}
          setAnalyzeDomain={setUrl}
        />
      )}
      
      <LoginDialog 
        isOpen={showLoginDialog} 
        onClose={() => setShowLoginDialog(false)} 
        returnTo="/suite"
      />
    </div>
  );
};

export default DashboardContent;
