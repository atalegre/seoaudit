
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Get the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Create a root and render the app
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Monitor LCP for performance diagnostics
if ('PerformanceObserver' in window) {
  try {
    new PerformanceObserver((entryList) => {
      const lcpEntry = entryList.getEntries()[0];
      console.log('LCP:', lcpEntry.startTime);
    }).observe({type: 'largest-contentful-paint', buffered: true});
  } catch (e) {
    console.warn('LCP measurement failed', e);
  }
}
