
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Cache crítico de conexões para domínios externos - implementado antes de qualquer renderização
const criticalDomains = [
  'https://fonts.googleapis.com', 
  'https://fonts.gstatic.com'
];

// Configurar conexões prioritárias imediatamente
criticalDomains.forEach(url => {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = url;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
});

// Configurar preconnect para domínios menos críticos de forma assíncrona
const secondaryDomains = [
  'https://www.googletagmanager.com',
  'https://logo.clearbit.com',
  'https://region1.google-analytics.com'
];

// Adiar conexões não críticas usando requestIdleCallback ou setTimeout
const setupSecondaryConnections = () => {
  secondaryDomains.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Usar requestIdleCallback se disponível, ou setTimeout como fallback
if ('requestIdleCallback' in window) {
  window.requestIdleCallback(setupSecondaryConnections);
} else {
  setTimeout(setupSecondaryConnections, 1000);
}

// Elemento raiz do aplicativo - obtido apenas uma vez
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

// Define the LayoutShiftEntry interface to fix TypeScript errors
interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

// Configuração da métrica CWV otimizada - com menor prioridade usando microtasks
const reportCoreWebVitals = () => {
  // Adiar a medição para não competir com a renderização inicial
  queueMicrotask(() => {
    if (!('performance' in window) || !('getEntriesByType' in performance)) {
      return;
    }
    
    // FCP - Otimizado para não bloquear
    setTimeout(() => {
      try {
        const paintMetrics = performance.getEntriesByType('paint');
        const fcpEntry = paintMetrics.find(entry => entry.name === 'first-contentful-paint');
        
        if (fcpEntry) {
          console.log(`FCP: ${Math.round(fcpEntry.startTime)}ms`);
        }
      } catch (e) {
        console.warn('FCP measurement failed:', e);
      }
    }, 0);
    
    // LCP - Otimizado com tratamento de erros adequado
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
    
    // CLS - Com melhor detecção e adiamento
    setTimeout(() => {
      try {
        const clsObserver = new PerformanceObserver((entryList) => {
          let clsValue = 0;
          for (const entry of entryList.getEntries()) {
            // Use type assertion to access LayoutShiftEntry properties
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
};

// Estratégia de renderização assíncrona para melhorar LCP/FCP
const renderApp = () => {
  // Criar a raiz React sem bloquear o thread principal
  const root = createRoot(rootElement);
  
  // Renderizar em um microtask para permitir que o browser pinte o que já está disponível
  queueMicrotask(() => {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Ativar métricas depois que a renderização inicial tiver ocorrido
    setTimeout(reportCoreWebVitals, 100);
  });
};

// Estratégia otimizada de inicialização baseada no readyState
if (document.readyState === 'loading') {
  // DOM ainda não está pronto - usar evento
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  // DOM já está disponível - renderizar imediatamente
  renderApp();
}
