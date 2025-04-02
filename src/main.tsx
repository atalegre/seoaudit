
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Otimizar carregamento diferido para melhorar o LCP
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

// Verificar se o DOM já está carregado para inicialização rápida
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  // O DOM já está pronto, inicializar de imediato
  window.requestIdleCallback ? 
    window.requestIdleCallback(initApp, { timeout: 500 }) : 
    setTimeout(initApp, 1);
}

function initApp() {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  // Registrar métricas de performance
  if ('performance' in window && 'getEntriesByType' in performance) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const paintMetrics = performance.getEntriesByType('paint');
        const lcpEntry = paintMetrics.find(entry => entry.name === 'first-contentful-paint');
        if (lcpEntry) {
          console.log(`FCP: ${Math.round(lcpEntry.startTime)}ms`);
        }
      }, 0);
    });
  }
}
