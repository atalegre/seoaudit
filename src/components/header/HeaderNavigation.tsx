
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const HeaderNavigation = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationLinks = [
    { title: 'Home', path: '/' },
    { title: 'Como Funciona', path: '/como-funciona' },
    { title: 'FAQ', path: '/faq' },
    { title: 'Blog', path: '/blog' },
    { title: 'Contacto', path: '/contacto' },
  ];

  const resourcesDropdown = (
    <NavigationMenuItem>
      <NavigationMenuTrigger>Recursos</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white dark:bg-gray-900 shadow-lg">
          <li className="row-span-3">
            <NavigationMenuLink asChild>
              <Link
                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-br from-seo to-aio p-6 no-underline outline-none focus:shadow-md text-white"
                to="/guias/seo-aio-checklist"
              >
                <div className="mb-2 mt-4 text-lg font-medium">
                  SEO AIO Checklist
                </div>
                <p className="text-sm leading-tight text-white/80">
                  Lista completa para otimizar o seu site para SEO e AI.
                </p>
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link to="/guias" className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-seo/10 hover:text-seo focus:bg-seo/10 focus:text-seo")}>
                <div className="text-sm font-medium leading-none">Guias</div>
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Tutoriais e guias detalhados sobre SEO.</p>
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link to="/blog" className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-seo/10 hover:text-seo focus:bg-seo/10 focus:text-seo")}>
                <div className="text-sm font-medium leading-none">Blog</div>
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Artigos e novidades sobre SEO e AI.</p>
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link to="/glossario" className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-aio/10 hover:text-aio focus:bg-aio/10 focus:text-aio")}>
                <div className="text-sm font-medium leading-none">Glossário</div>
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Termos e conceitos de SEO e IA explicados.</p>
              </Link>
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );

  const renderMobileMenu = () => (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[350px]">
        <div className="flex flex-col gap-4 mt-8">
          <Link 
            to="/" 
            className="font-semibold text-lg text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          
          <div className="space-y-1">
            <p className="font-medium text-sm text-muted-foreground mb-1">Recursos</p>
            <div className="pl-3 border-l border-gray-200 space-y-3">
              <Link 
                to="/guias/seo-aio-checklist" 
                className="block text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                SEO AIO Checklist
              </Link>
              <Link 
                to="/guias" 
                className="block text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Guias
              </Link>
              <Link 
                to="/blog" 
                className="block text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                to="/glossario" 
                className="block text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Glossário
              </Link>
            </div>
          </div>
          
          {navigationLinks.slice(1).map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className="font-medium text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.title}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );

  const renderDesktopMenu = () => (
    <NavigationMenu className="hidden md:flex mr-auto">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/" className={navigationMenuTriggerStyle()}>
            Home
          </Link>
        </NavigationMenuItem>

        {resourcesDropdown}

        <NavigationMenuItem>
          <Link to="/como-funciona" className={navigationMenuTriggerStyle()}>
            Como Funciona
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/faq" className={navigationMenuTriggerStyle()}>
            FAQ
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/contacto" className={navigationMenuTriggerStyle()}>
            Contacto
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );

  return (
    <>
      {renderMobileMenu()}
      {renderDesktopMenu()}
    </>
  );
};

export default HeaderNavigation;
