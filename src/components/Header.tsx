
import React from 'react';
import { Link } from 'react-router-dom';
import AuthButtons from './header/AuthButtons';
import HeaderNavigation from './header/HeaderNavigation';
import LanguageSwitcher from './LanguageSwitcher';
import DashboardButton from './header/buttons/DashboardButton';
import { useUser } from '@/contexts/UserContext';

const Header = () => {
  const { user, role } = useUser();
  
  // Determine dashboard path based on user role
  const getDashboardPath = () => {
    return role === 'admin' ? '/dashboard' : '/dashboard/client';
  };

  return (
    <header className="sticky top-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center">
          <img 
            src="/lovable-uploads/d5a32965-2a6a-49a6-8474-6efb96afd0f7.png" 
            alt="SEOAudit Logo" 
            className="h-16" 
          />
        </Link>
        
        <HeaderNavigation />
        
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />
          {user && <DashboardButton dashboardPath={getDashboardPath()} />}
          <AuthButtons />
        </div>
      </div>
    </header>
  );
};

export default Header;
