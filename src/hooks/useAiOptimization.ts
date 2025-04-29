
import { useState, useEffect, useCallback, useRef } from 'react';
import { createSeoAnalysisTask, pollTaskUntilComplete } from '@/utils/api/seoTaskManager';
import { toast } from 'sonner';

export interface AiOptimizationScores {
  overall: number;
  human_readability: number;
  llm_interpretability: number;
}

export interface AiOptimizationItem {
  title: string;
  explanation: string;
}

export interface AiOptimizationData {
  url: string;
  scores: AiOptimizationScores;
  strengths: AiOptimizationItem[];
  weaknesses: AiOptimizationItem[];
  recommendations: AiOptimizationItem[];
}

export function useAiOptimization() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [optimizationData, setOptimizationData] = useState<AiOptimizationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const lastTaskIdRef = useRef<string | null>(null);
  const analysisInProgressRef = useRef(false);

  // On mount: check for stored results and URL in sessionStorage
  useEffect(() => {
    const lastUrl = localStorage.getItem('lastAnalyzedUrl');
    const storedResults = sessionStorage.getItem('aio_optimization_results');
    const storedTaskId = sessionStorage.getItem('aio_task_id');
    const storedAnalyzingState = sessionStorage.getItem('aio_analyzing_state');
    
    // Set URL from localStorage (for form value)
    if (lastUrl) {
      setUrl(lastUrl);
    }
    
    // Restore previous results if available
    if (storedResults) {
      try {
        setOptimizationData(JSON.parse(storedResults));
      } catch (err) {
        console.error('Failed to parse stored AIO results:', err);
      }
    }
    
    // Restore task ID if available
    if (storedTaskId) {
      lastTaskIdRef.current = storedTaskId;
    }
    
    // Check if we were in the middle of analyzing
    if (storedAnalyzingState === 'true' && storedTaskId) {
      // Resume polling for in-progress task
      setIsAnalyzing(true);
      analysisInProgressRef.current = true;
      
      pollTaskUntilComplete(
        storedTaskId,
        (res) => {
          if (res.results) {
            const results = res.results as AiOptimizationData;
            setOptimizationData(results);
            sessionStorage.setItem('aio_optimization_results', JSON.stringify(results));
          }
        }
      ).then((finalRes) => {
        if (finalRes.status === 'success' && finalRes.results) {
          const results = finalRes.results as AiOptimizationData;
          setOptimizationData(results);
          sessionStorage.setItem('aio_optimization_results', JSON.stringify(results));
          toast.success("Análise de otimização para IA concluída");
        } else if (finalRes.status === 'failed') {
          setError(finalRes.message || "AI optimization analysis failed.");
          toast.error("Falha na análise de otimização para IA", { description: finalRes.message });
        }
        
        setIsAnalyzing(false);
        analysisInProgressRef.current = false;
        sessionStorage.setItem('aio_analyzing_state', 'false');
      }).catch((err) => {
        setError(err?.message || 'Erro na análise de otimização para IA');
        toast.error("Falha no polling da análise");
        
        setIsAnalyzing(false);
        analysisInProgressRef.current = false;
        sessionStorage.setItem('aio_analyzing_state', 'false');
      });
    }
  }, []);

  const analyzeUrl = useCallback(async (urlToAnalyze = url) => {
    // Prevent multiple concurrent analyses
    if (analysisInProgressRef.current) {
      console.log('Analysis already in progress, ignoring duplicate request');
      return;
    }

    // Reset state
    setOptimizationData(null);
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
    sessionStorage.setItem('aio_analyzing_state', 'true');

    toast.info("Análise agendada", {
      description: "A análise de otimização para IA será executada em background via tarefa."
    });

    try {
      // Create the AI optimization task
      const { taskId } = await createSeoAnalysisTask({
        url: normalizedUrl,
        task_name: 'ai_optimization' // Now this is correctly typed
      });
      lastTaskIdRef.current = taskId;
      sessionStorage.setItem('aio_task_id', taskId);
      toast.info("Tarefa de otimização para IA agendada", { description: "Aguardando resultados..." });

      // Poll for task completion
      pollTaskUntilComplete(
        taskId,
        (res) => {
          if (res.results) {
            const results = res.results as AiOptimizationData;
            setOptimizationData(results);
            // Store results in sessionStorage for persistence across navigation
            sessionStorage.setItem('aio_optimization_results', JSON.stringify(results));
          }
        }
      ).then((finalRes) => {
        if (finalRes.status === 'success' && finalRes.results) {
          const results = finalRes.results as AiOptimizationData;
          setOptimizationData(results);
          sessionStorage.setItem('aio_optimization_results', JSON.stringify(results));
          toast.success("Análise de otimização para IA concluída");
        } else if (finalRes.status === 'failed') {
          setError(finalRes.message || "AI optimization analysis failed.");
          toast.error("Falha na análise de otimização para IA", { description: finalRes.message });
        }
        
        setIsAnalyzing(false);
        analysisInProgressRef.current = false;
        sessionStorage.setItem('aio_analyzing_state', 'false');
      }).catch((err) => {
        setError(err?.message || 'Erro na análise de otimização para IA');
        toast.error("Falha no polling da análise");
        
        setIsAnalyzing(false);
        analysisInProgressRef.current = false;
        sessionStorage.setItem('aio_analyzing_state', 'false');
      });
    } catch (err: any) {
      setError(err.message || "Erro ao agendar análise de otimização para IA.");
      toast.error("Erro ao iniciar análise", { description: err.message });
      setIsAnalyzing(false);
      analysisInProgressRef.current = false;
      sessionStorage.setItem('aio_analyzing_state', 'false');
    }
  }, [url]);

  // Handler for URL input changes
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  // Handler for "reanalyze" button
  const handleReanalyze = () => {
    setOptimizationData(null);
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
    optimizationData,
    error,
    handleUrlChange,
    handleReanalyze,
    extractDomain,
    analyzeUrl
  };
}
