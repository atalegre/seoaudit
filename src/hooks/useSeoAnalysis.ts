
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

  // On mount: check for stored results and URL in sessionStorage
  useEffect(() => {
    const lastUrl = localStorage.getItem('lastAnalyzedUrl');
    const storedDesktopResults = sessionStorage.getItem('seo_desktop_results');
    const storedMobileResults = sessionStorage.getItem('seo_mobile_results');
    const storedDesktopTaskId = sessionStorage.getItem('seo_desktop_task_id');
    const storedMobileTaskId = sessionStorage.getItem('seo_mobile_task_id');
    const storedAnalyzingState = sessionStorage.getItem('seo_analyzing_state');
    
    // Set URL from localStorage (for form value)
    if (lastUrl) {
      setUrl(lastUrl);
    }
    
    // Restore previous results if available
    if (storedDesktopResults) {
      try {
        setDesktopData(JSON.parse(storedDesktopResults));
      } catch (err) {
        console.error('Failed to parse stored desktop results:', err);
      }
    }
    
    if (storedMobileResults) {
      try {
        setMobileData(JSON.parse(storedMobileResults));
      } catch (err) {
        console.error('Failed to parse stored mobile results:', err);
      }
    }
    
    // Restore task IDs if available
    if (storedDesktopTaskId) {
      lastDesktopTaskIdRef.current = storedDesktopTaskId;
    }
    
    if (storedMobileTaskId) {
      lastMobileTaskIdRef.current = storedMobileTaskId;
    }
    
    // Check if we were in the middle of analyzing
    if (storedAnalyzingState === 'true' && (storedDesktopTaskId || storedMobileTaskId)) {
      // Resume polling for in-progress tasks
      setIsAnalyzing(true);
      analysisInProgressRef.current = true;
      
      // Resume desktop polling if needed
      if (storedDesktopTaskId) {
        pollTaskUntilComplete(
          storedDesktopTaskId,
          (res) => {
            if (res.results) {
              const results = res.results as PageInsightsData;
              setDesktopData(results);
              sessionStorage.setItem('seo_desktop_results', JSON.stringify(results));
            }
          }
        ).then((finalRes) => {
          if (finalRes.status === 'success' && finalRes.results) {
            const results = finalRes.results as PageInsightsData;
            setDesktopData(results);
            sessionStorage.setItem('seo_desktop_results', JSON.stringify(results));
            toast.success("Análise desktop concluída");
          } else if (finalRes.status === 'failed') {
            setError(err =>
              (err ? err + " " : "") + (finalRes.message || "Desktop analysis failed.")
            );
            toast.error("Falha na análise desktop", { description: finalRes.message });
          }
          
          // Only set analyzing to false if both tasks are complete
          if (!lastMobileTaskIdRef.current) {
            setIsAnalyzing(false);
            analysisInProgressRef.current = false;
            sessionStorage.setItem('seo_analyzing_state', 'false');
          }
        }).catch((err) => {
          setError(e => (e ? e + " " : "") + (err?.message || 'Erro na Desktop'));
          toast.error("Falha no polling Desktop");
          
          // Only set analyzing to false if both tasks are complete
          if (!lastMobileTaskIdRef.current) {
            setIsAnalyzing(false);
            analysisInProgressRef.current = false;
            sessionStorage.setItem('seo_analyzing_state', 'false');
          }
        });
      }
      
      // Resume mobile polling if needed
      if (storedMobileTaskId) {
        pollTaskUntilComplete(
          storedMobileTaskId,
          (res) => {
            if (res.results) {
              const results = res.results as PageInsightsData;
              setMobileData(results);
              sessionStorage.setItem('seo_mobile_results', JSON.stringify(results));
            }
          }
        ).then((finalRes) => {
          if (finalRes.status === 'success' && finalRes.results) {
            const results = finalRes.results as PageInsightsData;
            setMobileData(results);
            sessionStorage.setItem('seo_mobile_results', JSON.stringify(results));
            toast.success("Análise mobile concluída");
          } else if (finalRes.status === 'failed') {
            setError(err =>
              (err ? err + " " : "") + (finalRes.message || "Mobile analysis failed.")
            );
            toast.error("Falha na análise mobile", { description: finalRes.message });
          }
          
          // Only set analyzing to false if both tasks are complete
          if (!lastDesktopTaskIdRef.current) {
            setIsAnalyzing(false);
            analysisInProgressRef.current = false;
            sessionStorage.setItem('seo_analyzing_state', 'false');
          }
        }).catch((err) => {
          setError(e => (e ? e + " " : "") + (err?.message || 'Erro na Mobile'));
          toast.error("Falha no polling Mobile");
          
          // Only set analyzing to false if both tasks are complete
          if (!lastDesktopTaskIdRef.current) {
            setIsAnalyzing(false);
            analysisInProgressRef.current = false;
            sessionStorage.setItem('seo_analyzing_state', 'false');
          }
        });
      }
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
    sessionStorage.setItem('seo_analyzing_state', 'true');

    toast.info("Análise agendada", {
      description: "A análise SEO será executada em background via tarefa."
    });

    try {
      // -- Desktop analysis task - create only one task
      const { taskId: desktopTaskId } = await createSeoAnalysisTask({
        url: normalizedUrl,
        platform: 'desktop',
        task_name: 'seo_analysis'
      });
      lastDesktopTaskIdRef.current = desktopTaskId;
      sessionStorage.setItem('seo_desktop_task_id', desktopTaskId);
      toast.info("Tarefa Desktop agendada", { description: "Aguardando resultados desktop..." });

      // -- Mobile analysis task - create only one task
      const { taskId: mobileTaskId } = await createSeoAnalysisTask({
        url: normalizedUrl,
        platform: 'mobile',
        task_name: 'seo_analysis'
      });
      lastMobileTaskIdRef.current = mobileTaskId;
      sessionStorage.setItem('seo_mobile_task_id', mobileTaskId);
      toast.info("Tarefa Mobile agendada", { description: "Aguardando resultados mobile..." });

      // Track completion of both tasks
      let desktopComplete = false;
      let mobileComplete = false;

      // Poll Desktop (do not wait, let both run in parallel)
      pollTaskUntilComplete(
        desktopTaskId,
        (res) => {
          if (res.results) {
            console.log('Desktop task interim results:', res.results);
            const results = res.results as PageInsightsData;
            setDesktopData(results);
            sessionStorage.setItem('seo_desktop_results', JSON.stringify(results));
          }
        }
      ).then((finalRes) => {
        desktopComplete = true;
        if (finalRes.status === 'success' && finalRes.results) {
          console.log('Desktop task final results:', finalRes.results);
          const results = finalRes.results as PageInsightsData;
          setDesktopData(results);
          sessionStorage.setItem('seo_desktop_results', JSON.stringify(results));
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
          sessionStorage.setItem('seo_analyzing_state', 'false');
        }
      }).catch((err) => {
        desktopComplete = true;
        setError(e => (e ? e + " " : "") + (err?.message || 'Erro na Desktop'));
        toast.error("Falha no polling Desktop");
        
        // If both tasks are complete, set analyzing to false
        if (desktopComplete && mobileComplete) {
          setIsAnalyzing(false);
          analysisInProgressRef.current = false;
          sessionStorage.setItem('seo_analyzing_state', 'false');
        }
      });

      // Poll Mobile
      pollTaskUntilComplete(
        mobileTaskId,
        (res) => {
          if (res.results) {
            console.log('Mobile task interim results:', res.results);
            const results = res.results as PageInsightsData;
            setMobileData(results);
            sessionStorage.setItem('seo_mobile_results', JSON.stringify(results));
          }
        }
      ).then((finalRes) => {
        mobileComplete = true;
        if (finalRes.status === 'success' && finalRes.results) {
          console.log('Mobile task final results:', finalRes.results);
          const results = finalRes.results as PageInsightsData;
          setMobileData(results);
          sessionStorage.setItem('seo_mobile_results', JSON.stringify(results));
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
          sessionStorage.setItem('seo_analyzing_state', 'false');
        }
      }).catch((err) => {
        mobileComplete = true;
        setError(e => (e ? e + " " : "") + (err?.message || 'Erro na Mobile'));
        toast.error("Falha no polling Mobile");
        
        // If both tasks are complete, set analyzing to false
        if (desktopComplete && mobileComplete) {
          setIsAnalyzing(false);
          analysisInProgressRef.current = false;
          sessionStorage.setItem('seo_analyzing_state', 'false');
        }
      });
    } catch (err: any) {
      setError(err.message || "Erro ao agendar análise.");
      toast.error("Erro ao iniciar análise", { description: err.message });
      setIsAnalyzing(false);
      analysisInProgressRef.current = false;
      sessionStorage.setItem('seo_analyzing_state', 'false');
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
      if (key.startsWith('psi_') || key.startsWith('seo_')) sessionStorage.removeItem(key);
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
    extractDomain,
    analyzeUrl
  };
}
