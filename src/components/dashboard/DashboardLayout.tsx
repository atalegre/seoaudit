
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import TopNavbar from './TopNavbar';
import SidebarContent, { adminSidebarItems, clientSidebarItems } from './SidebarContent';
import { useUser } from '@/contexts/UserContext';
import { Loader2 } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, userEmail, userName, userRole, isLoading } = useAuthCheck();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect to login if not authenticated, but store the current path to redirect back after login
  useEffect(() => {
    if (!isLoading && !user) {
      // Save the current path to redirect back after login
      navigate('/signin', { 
        state: { 
          returnTo: location.pathname + location.search
        } 
      });
    }
  }, [user, isLoading, navigate, location]);
  
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
  
  // If not loading and no user, we're redirecting, so don't render the dashboard
  if (!user) {
    return null;
  }
  
  // Choose appropriate sidebar items based on user role
  const sidebarItems = userRole === 'admin' ? adminSidebarItems : clientSidebarItems;
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navbar */}
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
