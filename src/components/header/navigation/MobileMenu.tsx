
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getLocalizedPath } from './PathUtils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileMenuProps {
  t: (key: string) => string;
  language: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  navigationLinks: Array<{ title: string; path: string }>;
}

export const MobileMenu = ({ 
  t, 
  language, 
  isOpen, 
  setIsOpen, 
  navigationLinks 
}: MobileMenuProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden flex">
          <Menu className="h-6 w-6" />
          <span className="sr-only">{t('open-menu')}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[350px] z-50">
        <div className="flex flex-col gap-4 mt-8">
          <Link 
            to="/" 
            className="font-semibold text-lg text-primary"
            onClick={() => setIsOpen(false)}
          >
            {t('home')}
          </Link>
          
          <div className="space-y-1">
            <p className="font-medium text-sm text-muted-foreground mb-1">{t('resources')}</p>
            <div className="pl-3 border-l border-gray-200 space-y-3">
              <Link 
                to={getLocalizedPath('/guias/seo-aio-checklist', '/guides/seo-aio-checklist', language)} 
                className="block text-sm"
                onClick={() => setIsOpen(false)}
              >
                {t('checklist')}
              </Link>
              <Link 
                to={getLocalizedPath('/guias', '/guides', language)} 
                className="block text-sm"
                onClick={() => setIsOpen(false)}
              >
                {t('guides')}
              </Link>
              <Link 
                to="/blog" 
                className="block text-sm"
                onClick={() => setIsOpen(false)}
              >
                {t('blog')}
              </Link>
              <Link 
                to={getLocalizedPath('/glossario', '/glossary', language)} 
                className="block text-sm"
                onClick={() => setIsOpen(false)}
              >
                {t('glossary')}
              </Link>
            </div>
          </div>
          
          {navigationLinks.slice(1).map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className="font-medium text-sm"
              onClick={() => setIsOpen(false)}
            >
              {link.title}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
