
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const { t, language } = useLanguage();

  const getLocalizedPath = (path: string) => {
    // Mapear caminhos entre idiomas
    const pathMap: Record<string, Record<string, string>> = {
      '/como-funciona': {
        'pt': '/como-funciona',
        'en': '/how-it-works'
      },
      '/how-it-works': {
        'pt': '/como-funciona',
        'en': '/how-it-works'
      },
      '/contacto': {
        'pt': '/contacto',
        'en': '/contact'
      },
      '/contact': {
        'pt': '/contacto',
        'en': '/contact'
      },
      '/glossario': {
        'pt': '/glossario',
        'en': '/glossary'
      },
      '/glossary': {
        'pt': '/glossario',
        'en': '/glossary'
      },
      '/guias': {
        'pt': '/guias',
        'en': '/guides'
      },
      '/guides': {
        'pt': '/guias',
        'en': '/guides'
      },
      '/guias/seo-aio-checklist': {
        'pt': '/guias/seo-aio-checklist',
        'en': '/guides/seo-aio-checklist'
      },
      '/guides/seo-aio-checklist': {
        'pt': '/guias/seo-aio-checklist',
        'en': '/guides/seo-aio-checklist'
      },
      '/recuperar-password': {
        'pt': '/recuperar-password',
        'en': '/forgot-password'
      },
      '/forgot-password': {
        'pt': '/recuperar-password',
        'en': '/forgot-password'
      }
    };

    // Se o caminho existe no mapa, retornar o caminho para o idioma atual
    if (path in pathMap) {
      return pathMap[path][language];
    }

    // Para outros caminhos, manter o original
    return path;
  };

  const navigationLinks = [
    { title: t('home'), path: '/' },
    { title: t('how-it-works'), path: getLocalizedPath('/como-funciona') },
    { title: t('faq'), path: '/faq' },
    { title: t('blog'), path: '/blog' },
    { title: t('contact'), path: getLocalizedPath('/contacto') },
  ];

  const resourcesDropdown = (
    <NavigationMenuItem>
      <NavigationMenuTrigger>{t('resources')}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white dark:bg-gray-900 shadow-lg">
          <li className="row-span-3">
            <NavigationMenuLink asChild>
              <Link
                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-br from-seo to-aio p-6 no-underline outline-none focus:shadow-md text-white"
                to={getLocalizedPath('/guias/seo-aio-checklist')}
              >
                <div className="mb-2 mt-4 text-lg font-medium">
                  {t('checklist')}
                </div>
                <p className="text-sm leading-tight text-white/80">
                  {t('checklist-desc')}
                </p>
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link to={getLocalizedPath('/guias')} className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-seo/10 hover:text-seo focus:bg-seo/10 focus:text-seo")}>
                <div className="text-sm font-medium leading-none">{t('guides')}</div>
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  {t('guides-desc')}
                </p>
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link to="/blog" className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-seo/10 hover:text-seo focus:bg-seo/10 focus:text-seo")}>
                <div className="text-sm font-medium leading-none">{t('blog')}</div>
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  {t('blog-desc')}
                </p>
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link to={getLocalizedPath('/glossario')} className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-aio/10 hover:text-aio focus:bg-aio/10 focus:text-aio")}>
                <div className="text-sm font-medium leading-none">{t('glossary')}</div>
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  {t('glossary-desc')}
                </p>
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
          <span className="sr-only">{t('open-menu')}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[350px]">
        <div className="flex flex-col gap-4 mt-8">
          <Link 
            to="/" 
            className="font-semibold text-lg text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            {t('home')}
          </Link>
          
          <div className="space-y-1">
            <p className="font-medium text-sm text-muted-foreground mb-1">{t('resources')}</p>
            <div className="pl-3 border-l border-gray-200 space-y-3">
              <Link 
                to={getLocalizedPath('/guias/seo-aio-checklist')} 
                className="block text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('checklist')}
              </Link>
              <Link 
                to={getLocalizedPath('/guias')} 
                className="block text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('guides')}
              </Link>
              <Link 
                to="/blog" 
                className="block text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('blog')}
              </Link>
              <Link 
                to={getLocalizedPath('/glossario')} 
                className="block text-sm"
                onClick={() => setIsMenuOpen(false)}
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
            {t('home')}
          </Link>
        </NavigationMenuItem>

        {resourcesDropdown}

        <NavigationMenuItem>
          <Link to={getLocalizedPath('/como-funciona')} className={navigationMenuTriggerStyle()}>
            {t('how-it-works')}
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/faq" className={navigationMenuTriggerStyle()}>
            {t('faq')}
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to={getLocalizedPath('/contacto')} className={navigationMenuTriggerStyle()}>
            {t('contact')}
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
