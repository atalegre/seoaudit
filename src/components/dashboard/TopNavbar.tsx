
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserDropdownMenu from './UserDropdownMenu';
import SidebarContent, { adminSidebarItems } from './SidebarContent';

interface TopNavbarProps {
  isMobile: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userRole: string;
  userName: string;
  userEmail: string;
  user: any;
}

const TopNavbar: React.FC<TopNavbarProps> = ({
  isMobile,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  userRole,
  userName,
  userEmail,
  user
}) => {
  // Always use admin sidebar items
  const sidebarItems = adminSidebarItems;

  return (
    <header className="bg-white border-b h-14 md:h-16 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-2">
        {isMobile && (
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-4 border-b">
                <Link to="/dashboard" className="font-bold text-lg text-primary">
                  SEOAudit Admin
                </Link>
              </div>
              <SidebarContent 
                items={sidebarItems} 
                onMobileMenuClose={() => setIsMobileMenuOpen(false)}
              />
            </SheetContent>
          </Sheet>
        )}
        
        <Link to="/dashboard" className="font-bold text-xl text-primary">
          {isMobile ? "SEOAudit" : "SEOAudit Admin"}
        </Link>
      </div>
      
      <div className="flex items-center gap-2">
        {!isMobile && (
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Pesquisar..." 
              className="w-full pl-8"
            />
          </div>
        )}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        
        <UserDropdownMenu 
          userName={userName}
          userEmail={userEmail}
          userRole={userRole}
          user={user}
        />
      </div>
    </header>
  );
};

export default TopNavbar;
