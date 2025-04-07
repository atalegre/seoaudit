
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Inicialização direta e prioritária
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

// Renderizar App diretamente sem StrictMode para otimizar performance
const root = createRoot(rootElement);
root.render(<App />);

// Monitorar LCP para diagnóstico
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
