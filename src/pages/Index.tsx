
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MainAnalyzer from '@/components/analyzer/MainAnalyzer';
import AnalyzerWrapper from '@/components/analyzer/AnalyzerWrapper';
import FeatureHighlights from '@/components/home/FeatureHighlights';
import HowItWorks from '@/components/home/HowItWorks';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import CTASection from '@/components/home/CTASection';
import TestimonialsSection from '@/components/home/TestimonialsSection';

const Index = () => {
  // Move the useEffect inside the component
  useEffect(() => {
    // Find form elements that should be modified
    const formHandler = () => {
      const forms = document.querySelectorAll('form[data-analyze-form]');
      
      forms.forEach(form => {
        // Remove existing listeners by cloning
        const newForm = form.cloneNode(true);
        if (form.parentNode) {
          form.parentNode.replaceChild(newForm, form);
          
          // Add our custom listener
          if (newForm instanceof HTMLElement) {
            newForm.addEventListener('submit', (e) => {
              e.preventDefault();
              
              // Get the URL value and properly type it
              const urlInput = newForm.querySelector('input[type="url"], input[type="text"]');
              // Ensure urlInput is an HTMLInputElement before accessing its value property
              const url = urlInput instanceof HTMLInputElement ? urlInput.value : '';
              
              if (url) {
                // Dispatch our custom event
                const customEvent = new CustomEvent('seoaudit:analyze', { 
                  detail: { url } 
                });
                window.dispatchEvent(customEvent);
              }
            });
          }
        }
      });
    };
    
    // Run once and also set an interval to handle dynamically added forms
    formHandler();
    const interval = setInterval(formHandler, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <AnalyzerWrapper>
          <MainAnalyzer />
        </AnalyzerWrapper>
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
