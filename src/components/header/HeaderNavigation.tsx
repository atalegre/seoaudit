
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
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
  return (
    <NavigationMenu className="hidden md:flex mr-auto">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/" className={navigationMenuTriggerStyle()}>
            Home
          </Link>
        </NavigationMenuItem>

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
};

export default HeaderNavigation;
