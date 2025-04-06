
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Optimize loading strategy to improve LCP and FCP
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

// Use requestIdleCallback to defer non-critical work
const startApp = () => {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  // Report core web vitals
  if ('performance' in window && 'getEntriesByType' in performance) {
    // Use rAF to measure after paint
    requestAnimationFrame(() => {
      setTimeout(() => {
        const paintMetrics = performance.getEntriesByType('paint');
        const fcpEntry = paintMetrics.find(entry => entry.name === 'first-contentful-paint');
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          // Log LCP for debugging
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

// Optimize initialization based on document readiness
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Prioritize critical rendering first
    requestAnimationFrame(() => {
      startApp();
    });
  });
} else {
  // DOM already loaded - start app with higher priority
  startApp();
}
