
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedPath } from './navigation/PathUtils';
import MobileMenu from './navigation/MobileMenu';
import DesktopMenu from './navigation/DesktopMenu';

const HeaderNavigation = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, language } = useLanguage();

  const navigationLinks = [
    { title: t('home'), path: '/' },
    { title: t('how-it-works'), path: getLocalizedPath('/como-funciona', '/how-it-works', language) },
    { title: t('faq'), path: '/faq' },
    { title: t('blog'), path: '/blog' },
    { title: t('contact'), path: getLocalizedPath('/contacto', '/contact', language) },
  ];

  return (
    <>
      <MobileMenu 
        t={t}
        language={language}
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
        navigationLinks={navigationLinks}
      />
      <DesktopMenu t={t} language={language} />
    </>
  );
};

export default HeaderNavigation;
