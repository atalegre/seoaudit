
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import TopNavbar from './TopNavbar';
import SidebarContent, { adminSidebarItems } from './SidebarContent';
import { Loader2 } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, userEmail, userName, userRole, isLoading } = useAuthCheck();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">A verificar autenticação...</p>
        </div>
      </div>
    );
  }
  
  // Use admin sidebar items regardless of user role since we've removed the client dashboard
  const sidebarItems = adminSidebarItems;
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navbar - Only render the main one */}
      <TopNavbar 
        isMobile={isMobile}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        userRole={userRole || 'user'}
        userName={userName}
        userEmail={userEmail || ''}
        user={user}
      />
      
      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        {!isMobile && (
          <aside className="w-64 border-r bg-gray-50 hidden md:block">
            <SidebarContent items={sidebarItems} />
          </aside>
        )}
        
        {/* Main content */}
        <main className="flex-1 p-3 md:p-6 bg-white overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
