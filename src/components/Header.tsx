
import React from 'react';
import { Link } from 'react-router-dom';
import HeaderNavigation from './header/HeaderNavigation';
import LanguageSwitcher from './LanguageSwitcher';
import { useUser } from '@/contexts/UserContext';
import { DashboardButton } from './header/buttons';
import AuthButtons from './header/AuthButtons';

const Header = () => {
  return (
    <header className="sticky top-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-4 flex items-center">
          <img 
            src="/lovable-uploads/d5a32965-2a6a-49a6-8474-6efb96afd0f7.png" 
            alt="SEOAudit Logo" 
            className="h-10 w-auto" 
          />
        </Link>
        
        <HeaderNavigation />
        
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />
          <DashboardButton />
          <AuthButtons />
        </div>
      </div>
    </header>
  );
};

export default Header;
