
import React from 'react';
import { Link } from 'react-router-dom';
import { UserProvider } from '@/contexts/UserContext';
import AuthButtons from './header/AuthButtons';
import HeaderNavigation from './header/HeaderNavigation';

const Header = () => {
  return (
    <UserProvider>
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
          
          <div className="ml-auto">
            <AuthButtons />
          </div>
        </div>
      </header>
    </UserProvider>
  );
};

export default Header;
