
import React from 'react';
import { useLocation } from 'react-router-dom';
import SuiteHeader from './SuiteHeader';
import SidebarContent from './SidebarContent';

interface SuiteLayoutProps {
  children: React.ReactNode;
  title?: string;
  domain?: string;
  lastAnalysisDate?: string;
  // These were missing from the interface:
  onRerunAnalysis?: () => void;
  isAnalyzing?: boolean;
}

const SuiteLayout = ({ 
  children, 
  title, 
  domain, 
  lastAnalysisDate
}: SuiteLayoutProps) => {
  const location = useLocation();
  const showBackButton = location.pathname !== '/suite';
  
  return (
    <div className="h-screen flex flex-col">
      {/* Header and top section */}
      <SuiteHeader 
        title={title} 
        domain={domain} 
        lastAnalysisDate={lastAnalysisDate} 
        showBackButton={showBackButton}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - width adjusted */}
        <aside className="w-14 border-r bg-white hidden md:block">
          <SidebarContent />
        </aside>
        
        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuiteLayout;
