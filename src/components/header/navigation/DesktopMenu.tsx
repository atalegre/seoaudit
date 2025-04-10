
import React from 'react';
import { Link } from 'react-router-dom';
import { getLocalizedPath } from './PathUtils';
import NavLink from './NavLink';
import ResourcesDropdown from './ResourcesDropdown';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface DesktopMenuProps {
  t: (key: string) => string;
  language: string;
}

export const DesktopMenu = ({ t, language }: DesktopMenuProps) => {
  return (
    <NavigationMenu className="hidden md:flex mr-auto">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/" className={navigationMenuTriggerStyle()}>
            {t('home')}
          </Link>
        </NavigationMenuItem>

        <ResourcesDropdown t={t} language={language} />

        <NavigationMenuItem>
          <NavLink to={getLocalizedPath('/como-funciona', '/how-it-works', language)}>
            {t('how-it-works')}
          </NavLink>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavLink to="/faq">
            {t('faq')}
          </NavLink>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavLink to={getLocalizedPath('/contacto', '/contact', language)}>
            {t('contact')}
          </NavLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopMenu;
