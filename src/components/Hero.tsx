
import React, { useState } from 'react';

const Hero = () => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (url) {
      // Dispatch our custom event
      const customEvent = new CustomEvent('seoaudit:analyze', { 
        detail: { url } 
      });
      window.dispatchEvent(customEvent);
      console.log('Dispatched analyze event for URL:', url);
    }
  };

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="max-w-2xl text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Optimize your website for <span className="text-violet-600">Google</span> and <span className="text-blue-600">AI</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Discover how to improve your search visibility in both traditional engines and new AI-driven models.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row items-center gap-4">
            <input
              type="url"
              placeholder="https://seusite.com"
              className="w-full sm:w-auto flex-1 px-4 py-2 border border-gray-300 rounded-md"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-violet-600 text-white font-semibold rounded-md hover:bg-violet-700"
            >
              Analisar site grátis
            </button>
          </form>
        </div>

        {/* Ilustração ou imagem à direita */}
        <div className="hidden md:block w-full max-w-md">
          <img
            src="/illustrations/hero-mockup.png"
            alt="SEOaudit preview"
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
