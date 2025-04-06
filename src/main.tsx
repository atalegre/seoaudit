import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Lista de domínios para preconnect - reduz tempo de estabelecimento de conexão
const preconnectDomains = [
  'https://fonts.googleapis.com', 
  'https://fonts.gstatic.com', 
  'https://www.googletagmanager.com',
  'https://logo.clearbit.com',
  'https://region1.google-analytics.com'
];

// Preconnect crítico - implementa conexões antecipadas para recursos externos
preconnectDomains.forEach(url => {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = url;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
});

// Otimizar carregamento crítico - prioriza renderização inicial
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

// Define the LayoutShiftEntry interface to fix TypeScript errors
interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

// Função para reportar métricas de performance
const reportCoreWebVitals = () => {
  if ('performance' in window && 'getEntriesByType' in performance) {
    // Usar requestPostAnimationFrame para medir após pintura
    requestAnimationFrame(() => {
      setTimeout(() => {
        const paintMetrics = performance.getEntriesByType('paint');
        const fcpEntry = paintMetrics.find(entry => entry.name === 'first-contentful-paint');
        
        // Capturar e reportar LCP
        try {
          const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log(`LCP: ${lastEntry.startTime}ms`);
            lcpObserver.disconnect();
          });
          
          lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (e) {
          console.warn('LCP reporting failed:', e);
        }
        
        // Reportar FCP se disponível
        if (fcpEntry) {
          console.log(`FCP: ${Math.round(fcpEntry.startTime)}ms`);
        }
        
        // Capturar e reportar CLS
        try {
          const clsObserver = new PerformanceObserver((entryList) => {
            let clsValue = 0;
            for (const entry of entryList.getEntries()) {
              // Fix: Type assertion to access LayoutShiftEntry properties
              const layoutShiftEntry = entry as LayoutShiftEntry;
              if (!layoutShiftEntry.hadRecentInput) {
                clsValue += layoutShiftEntry.value;
              }
            }
            console.log(`CLS: ${clsValue}`);
          });
          
          clsObserver.observe({ type: 'layout-shift', buffered: true });
        } catch (e) {
          console.warn('CLS reporting failed:', e);
        }
      }, 0);
    });
  }
};

// Renderizar aplicação com estratégia otimizada para melhor FCP/LCP
const startApp = () => {
  // Criar e renderizar aplicação como microtask para não bloquear thread principal
  queueMicrotask(() => {
    createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Reportar métricas após render
    reportCoreWebVitals();
  });
};

// Otimizar estratégia de inicialização baseada no estado do DOM
if (document.readyState === 'loading') {
  // DOM ainda carregando - aguardar evento
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  // DOM já carregado - iniciar imediatamente 
  startApp();
}
