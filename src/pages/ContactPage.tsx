
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { useLanguage } from '@/contexts/LanguageContext';

const ContactPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto mb-10 text-center">
            <h1 className="text-3xl font-bold md:text-4xl mb-4">
              {t('contact-title')}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('contact-description')}
            </p>
          </div>

          <div className="mt-12">
            <ContactForm />
          </div>
          
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              {t('contact-additional')}
            </h2>
            <div className="grid md:grid-cols-2 gap-8 text-center">
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="font-medium text-xl mb-2">
                  {t('contact-hours')}
                </h3>
                <p className="text-muted-foreground">
                  {t('contact-hours-weekdays')}<br />
                  {t('contact-hours-weekend')}
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="font-medium text-xl mb-2">
                  {t('contact-email')}
                </h3>
                <p className="text-muted-foreground">
                  geral@seoaudit.pt<br />
                  suporte@seoaudit.pt
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
