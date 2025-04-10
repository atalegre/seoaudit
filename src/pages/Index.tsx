
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import FeatureCards from '@/components/home/FeatureCards';
import HowItWorks from '@/components/home/HowItWorks';
import CTASection from '@/components/home/CTASection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import ClientLogos from '@/components/home/ClientLogos';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import FeatureHighlights from '@/components/home/FeatureHighlights';
import FeaturesSection from '@/components/home/FeaturesSection';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-1">
        <Hero />
        <ClientLogos />
        <FeatureCards />
        <HowItWorks />
        <FeatureHighlights />
        <FeaturesSection />
        <WhyChooseUs />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
