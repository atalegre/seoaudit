
import React, { useEffect, useState } from 'react';
import SuiteLayout from '@/components/suite/SuiteLayout';
import { useSearchParams } from 'react-router-dom';
import KeywordResearch from '@/components/suite/keywords/KeywordResearch';
import { useUser } from '@/contexts/UserContext';
import LoginDialog from '@/components/auth/LoginDialog';

const KeywordsPage = () => {
  const [searchParams] = useSearchParams();
  const url = searchParams.get('url') || localStorage.getItem('lastAnalyzedUrl') || '';
  const { user } = useUser();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      setShowLoginDialog(true);
    }
  }, [user]);

  const formatDomain = (url: string) => {
    try {
      if (!url) return '';
      return new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    } catch (e) {
      return url;
    }
  };
  
  const domain = formatDomain(url);
  const lastAnalysisDate = new Date().toLocaleDateString('pt-PT');

  return (
    <SuiteLayout
      title="Pesquisa de Palavras-chave"
      domain={domain}
      lastAnalysisDate={lastAnalysisDate}
    >
      <KeywordResearch />
      
      {/* Login Dialog */}
      <LoginDialog 
        isOpen={showLoginDialog} 
        onClose={() => setShowLoginDialog(false)}
        returnTo="/suite/keywords"
      />
    </SuiteLayout>
  );
};

export default KeywordsPage;
