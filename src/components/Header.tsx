
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const isMobile = useIsMobile();
  
  const menuItems = [
    { title: 'Home', path: '/' },
    { title: 'Como Funciona', path: '/como-funciona' },
    { title: 'FAQ', path: '/faq' },
    { title: 'Contacto', path: '/contacto' },
  ];

  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <nav className="flex flex-col gap-4 mt-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="px-2 py-1 text-lg font-medium transition-colors hover:text-primary"
            >
              {item.title}
            </Link>
          ))}
          <div className="border-t pt-4 mt-2">
            <Link
              to="/signin"
              className="w-full flex items-center px-2 py-1 text-lg font-medium transition-colors hover:text-primary"
            >
              Entrar
            </Link>
            <Link
              to="/signup"
              className="w-full flex items-center px-2 py-1 text-lg font-medium transition-colors hover:text-primary"
            >
              Registrar
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );

  const DesktopNav = () => (
    <nav className="hidden md:flex gap-6">
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="flex items-center">
            <span className="text-seo">SEO</span>
            <span className="text-aio">AI</span>
          </div>
          <span>Checker</span>
        </div>
        <div className="flex items-center gap-4">
          <DesktopNav />
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/signin">
                Entrar
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/signup">
                <User className="mr-1 h-4 w-4" /> Registrar
              </Link>
            </Button>
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Header;
