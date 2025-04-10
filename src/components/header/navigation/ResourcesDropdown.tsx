
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getLocalizedPath } from './PathUtils';
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

interface ResourcesDropdownProps {
  t: (key: string) => string;
  language: string;
}

export const ResourcesDropdown = ({ t, language }: ResourcesDropdownProps) => {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>{t('resources')}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white dark:bg-gray-900 shadow-lg">
          <li className="row-span-3">
            <NavigationMenuLink asChild>
              <Link
                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-br from-seo to-aio p-6 no-underline outline-none focus:shadow-md text-white"
                to={getLocalizedPath('/guias/seo-aio-checklist', '/guides/seo-aio-checklist', language)}
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
              <Link to={getLocalizedPath('/guias', '/guides', language)} className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-seo/10 hover:text-seo focus:bg-seo/10 focus:text-seo")}>
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
              <Link to={getLocalizedPath('/glossario', '/glossary', language)} className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-aio/10 hover:text-aio focus:bg-aio/10 focus:text-aio")}>
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
};

export default ResourcesDropdown;
