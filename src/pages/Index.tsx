
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/contexts/LanguageContext';

const Index = () => {
  return (
    <LanguageProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Hero />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Index;
