
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import TopNavbar from './TopNavbar';
import SidebarContent, { adminSidebarItems, clientSidebarItems } from './SidebarContent';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, userEmail, userName, userRole, isLoading } = useAuthCheck();
  
  // Default to admin sidebar items so users can access all features without login
  const sidebarItems = adminSidebarItems;
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navbar */}
      <TopNavbar 
        isMobile={isMobile}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        userRole={userRole || 'admin'}
        userName={userName}
        userEmail={userEmail || 'guest@example.com'}
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
