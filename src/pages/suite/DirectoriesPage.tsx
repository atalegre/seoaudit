
import React, { useState } from 'react';
import SuiteLayout from '@/components/suite/SuiteLayout';
import { useSearchParams } from 'react-router-dom';
import DirectoryPresence from '@/components/suite/directories/DirectoryPresence';
import { useUser } from '@/contexts/UserContext';
import LoginDialog from '@/components/auth/LoginDialog';
import LocalDirectoryPresence from '@/components/LocalDirectoryPresence';

const DirectoriesPage = () => {
  const [searchParams] = useSearchParams();
  const url = searchParams.get('url') || localStorage.getItem('lastAnalyzedUrl') || '';
  const { user } = useUser();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  
  React.useEffect(() => {
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
      title="Presença em Diretórios"
      domain={domain}
      lastAnalysisDate={lastAnalysisDate}
    >
      <div className="space-y-6">
        {/* Local directory presence from existing component */}
        <LocalDirectoryPresence url={url} companyName={domain} />
        
        {/* Online directory presence from new component */}
        <DirectoryPresence />
      </div>
      
      {/* Login Dialog */}
      <LoginDialog 
        isOpen={showLoginDialog} 
        onClose={() => setShowLoginDialog(false)}
        returnTo="/suite/directories"
      />
    </SuiteLayout>
  );
};

export default DirectoriesPage;
