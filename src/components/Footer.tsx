
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t, language } = useLanguage();
  
  // Helper function to get localized paths
  const getLocalizedPath = (ptPath: string, enPath: string) => {
    return language === 'pt' ? ptPath : enPath;
  };
  
  return (
    <footer className="bg-gray-50 pt-16 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
          <div className="space-y-4">
            <div className="font-bold text-2xl">SEOAudit</div>
            <p className="text-gray-600">
              {t('footer-description')}
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">{t('navigation')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link to={getLocalizedPath('/como-funciona', '/how-it-works')} className="text-gray-600 hover:text-gray-900 transition-colors">
                  {t('how-it-works')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-gray-900 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">{t('resources')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to={getLocalizedPath('/guias', '/guides')} className="text-gray-600 hover:text-gray-900 transition-colors">
                  {t('guides')}
                </Link>
              </li>
              <li>
                <Link to={getLocalizedPath('/guias/seo-aio-checklist', '/guides/seo-aio-checklist')} className="text-gray-600 hover:text-gray-900 transition-colors">
                  {t('checklist')}
                </Link>
              </li>
              <li>
                <Link to={getLocalizedPath('/glossario', '/glossary')} className="text-gray-600 hover:text-gray-900 transition-colors">
                  {t('glossary')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">{t('contact')}</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">
                Email: info@seoaudit.pt
              </li>
              <li className="text-gray-600">
                {language === 'pt' ? 'Telefone' : 'Phone'}: +351 910 123 456
              </li>
              <li>
                <Link to={getLocalizedPath('/termos', '/terms')} className="text-gray-600 hover:text-gray-900 transition-colors">
                  {t('terms')}
                </Link>
              </li>
              <li>
                <Link to={getLocalizedPath('/privacidade', '/privacy')} className="text-gray-600 hover:text-gray-900 transition-colors">
                  {t('privacy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-6 pb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} SEOAudit. {t('rights-reserved')}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to={getLocalizedPath('/contacto', '/contact')} className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              {t('contact')}
            </Link>
            <Link to={getLocalizedPath('/termos', '/terms')} className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              {t('terms')}
            </Link>
            <Link to={getLocalizedPath('/privacidade', '/privacy')} className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              {t('privacy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
