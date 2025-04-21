
import { useState, useEffect, useCallback, useRef } from 'react';
import { createSeoAnalysisTask, pollTaskUntilComplete } from '@/utils/api/seoTaskManager';
import { toast } from 'sonner';

// Only import this type for structure, not for fetching:
import type { PageInsightsData } from '@/utils/api/pageInsights/types';

// The hook now uses the Seo Analysis Task Manager for all requests
export function useSeoAnalysis() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [desktopData, setDesktopData] = useState<PageInsightsData | null>(null);
  const [mobileData, setMobileData] = useState<PageInsightsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const lastDesktopTaskIdRef = useRef<string | null>(null);
  const lastMobileTaskIdRef = useRef<string | null>(null);
  const analysisInProgressRef = useRef(false);

  // On mount: if last analyzed URL in localStorage, run analysis
  useEffect(() => {
    const lastUrl = localStorage.getItem('lastAnalyzedUrl');
    if (lastUrl) {
      setUrl(lastUrl);
      analyzeUrl(lastUrl);
    }
  }, []);

  const analyzeUrl = useCallback(async (urlToAnalyze = url) => {
    // Prevent multiple concurrent analyses
    if (analysisInProgressRef.current) {
      console.log('Analysis already in progress, ignoring duplicate request');
      return;
    }

    // Reset state
    setDesktopData(null);
    setMobileData(null);
    setError(null);

    if (!urlToAnalyze) {
      toast("URL necessário", {
        description: "Por favor, insira uma URL válida para analisar."
      });
      return;
    }

    // Normalize URL
    let normalizedUrl = urlToAnalyze.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    localStorage.setItem('lastAnalyzedUrl', normalizedUrl);

    setIsAnalyzing(true);
    setError(null);
    analysisInProgressRef.current = true;

    toast.info("Análise agendada", {
      description: "A análise SEO será executada em background via tarefa."
    });

    try {
      // -- Desktop analysis task - create only one task
      const { taskId: desktopTaskId } = await createSeoAnalysisTask({
        url: normalizedUrl,
        platform: 'desktop'
      });
      lastDesktopTaskIdRef.current = desktopTaskId;
      toast.info("Tarefa Desktop agendada", { description: "Aguardando resultados desktop..." });

      // -- Mobile analysis task - create only one task
      const { taskId: mobileTaskId } = await createSeoAnalysisTask({
        url: normalizedUrl,
        platform: 'mobile'
      });
      lastMobileTaskIdRef.current = mobileTaskId;
      toast.info("Tarefa Mobile agendada", { description: "Aguardando resultados mobile..." });

      // Track completion of both tasks
      let desktopComplete = false;
      let mobileComplete = false;

      // Poll Desktop (do not wait, let both run in parallel)
      pollTaskUntilComplete(
        desktopTaskId,
        (res) => {
          if (res.results) setDesktopData(res.results as PageInsightsData);
        }
      ).then((finalRes) => {
        desktopComplete = true;
        if (finalRes.status === 'success' && finalRes.results) {
          setDesktopData(finalRes.results as PageInsightsData);
          toast.success("Análise desktop concluída");
        } else if (finalRes.status === 'failed') {
          setError(err =>
            (err ? err + " " : "") + (finalRes.message || "Desktop analysis failed.")
          );
          toast.error("Falha na análise desktop", { description: finalRes.message });
        }
        
        // If both tasks are complete, set analyzing to false
        if (desktopComplete && mobileComplete) {
          setIsAnalyzing(false);
          analysisInProgressRef.current = false;
        }
      }).catch((err) => {
        desktopComplete = true;
        setError(e => (e ? e + " " : "") + (err?.message || 'Erro na Desktop'));
        toast.error("Falha no polling Desktop");
        
        // If both tasks are complete, set analyzing to false
        if (desktopComplete && mobileComplete) {
          setIsAnalyzing(false);
          analysisInProgressRef.current = false;
        }
      });

      // Poll Mobile
      pollTaskUntilComplete(
        mobileTaskId,
        (res) => {
          if (res.results) setMobileData(res.results as PageInsightsData);
        }
      ).then((finalRes) => {
        mobileComplete = true;
        if (finalRes.status === 'success' && finalRes.results) {
          setMobileData(finalRes.results as PageInsightsData);
          toast.success("Análise mobile concluída");
        } else if (finalRes.status === 'failed') {
          setError(err =>
            (err ? err + " " : "") + (finalRes.message || "Mobile analysis failed.")
          );
          toast.error("Falha na análise mobile", { description: finalRes.message });
        }
        
        // If both tasks are complete, set analyzing to false
        if (desktopComplete && mobileComplete) {
          setIsAnalyzing(false);
          analysisInProgressRef.current = false;
        }
      }).catch((err) => {
        mobileComplete = true;
        setError(e => (e ? e + " " : "") + (err?.message || 'Erro na Mobile'));
        toast.error("Falha no polling Mobile");
        
        // If both tasks are complete, set analyzing to false
        if (desktopComplete && mobileComplete) {
          setIsAnalyzing(false);
          analysisInProgressRef.current = false;
        }
      });
    } catch (err: any) {
      setError(err.message || "Erro ao agendar análise.");
      toast.error("Erro ao iniciar análise", { description: err.message });
      setIsAnalyzing(false);
      analysisInProgressRef.current = false;
    }
  }, [url]);

  // Handler for URL input changes
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  // Handler for "reanalyze" button
  const handleReanalyze = () => {
    // Clean cache
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('psi_')) sessionStorage.removeItem(key);
    });
    setDesktopData(null);
    setMobileData(null);
    setError(null);
    toast.info("Iniciando nova análise...");
    analyzeUrl();
  };

  const extractDomain = (url: string) => {
    try {
      return new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    } catch (e) {
      return url;
    }
  };

  return {
    url,
    isAnalyzing,
    desktopData,
    mobileData,
    error,
    handleUrlChange,
    handleReanalyze,
    extractDomain
  };
}
