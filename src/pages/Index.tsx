
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MainAnalyzer from '@/components/analyzer/MainAnalyzer';
import FeatureHighlights from '@/components/home/FeatureHighlights';
import HowItWorks from '@/components/home/HowItWorks';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import CTASection from '@/components/home/CTASection';
import TestimonialsSection from '@/components/home/TestimonialsSection';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <MainAnalyzer />
        <HowItWorks />
        <FeatureHighlights />
        <WhyChooseUs />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
