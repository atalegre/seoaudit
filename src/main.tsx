
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Implement connection preloading for critical resources
const preconnectLinks = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com', 'https://www.googletagmanager.com'];
preconnectLinks.forEach(url => {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = url;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
});

// Optimize loading strategy to improve LCP and FCP
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

// Use requestIdleCallback to defer non-critical work
const startApp = () => {
  // Create a flushing microtask to prioritize LCP elements
  Promise.resolve().then(() => {
    createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  });
  
  // Report core web vitals
  if ('performance' in window && 'getEntriesByType' in performance) {
    // Use rAF to measure after paint
    requestAnimationFrame(() => {
      setTimeout(() => {
        const paintMetrics = performance.getEntriesByType('paint');
        const fcpEntry = paintMetrics.find(entry => entry.name === 'first-contentful-paint');
        
        // Use PerformanceObserver to capture LCP
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log(`LCP: ${lastEntry.startTime}ms`);
          lcpObserver.disconnect();
        });
        
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        
        if (fcpEntry) {
          console.log(`FCP: ${Math.round(fcpEntry.startTime)}ms`);
        }
      }, 0);
    });
  }
};

// Priorize critical content rendering
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(startApp);
  });
} else {
  // DOM already loaded - start app immediately
  startApp();
}
