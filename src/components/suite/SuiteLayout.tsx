
import React from 'react';
import { useLocation } from 'react-router-dom';
import NewSuiteHeader from './NewSuiteHeader';
import NewSidebarContent from './NewSidebarContent';

interface SuiteLayoutProps {
  children: React.ReactNode;
  title?: string;
  domain?: string;
  lastAnalysisDate?: string;
  onRerunAnalysis?: () => void;
  isAnalyzing?: boolean;
  showBackButton?: boolean;
  hideSidebar?: boolean;  // Property to hide the sidebar
}

const SuiteLayout = ({ 
  children, 
  title, 
  domain, 
  lastAnalysisDate,
  showBackButton,
  hideSidebar = false  // Default to false
}: SuiteLayoutProps) => {
  const location = useLocation();
  // Use the prop if provided, otherwise determine based on location
  const shouldShowBackButton = showBackButton !== undefined ? showBackButton : location.pathname !== '/suite';
  
  return (
    <div className="h-screen flex flex-col">
      {/* New Header component */}
      <NewSuiteHeader 
        title={title} 
        domain={domain} 
        lastAnalysisDate={lastAnalysisDate} 
        showBackButton={shouldShowBackButton}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - conditionally rendered */}
        {!hideSidebar && (
          <aside className="w-14 border-r bg-white hidden md:block">
            <NewSidebarContent />
          </aside>
        )}
        
        {/* Main content area */}
        <main className={`flex-1 overflow-auto bg-gray-50 ${hideSidebar ? 'w-full' : ''}`}>
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuiteLayout;
