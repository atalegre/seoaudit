
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
      toast.info("Tarefa de otimização para IA agendada", { description: "Aguardando resultados..." });

      // Poll for task completion
      pollTaskUntilComplete(
        taskId,
        (res) => {
          if (res.results) setOptimizationData(res.results as AiOptimizationData);
        }
      ).then((finalRes) => {
        if (finalRes.status === 'success' && finalRes.results) {
          setOptimizationData(finalRes.results as AiOptimizationData);
          toast.success("Análise de otimização para IA concluída");
        } else if (finalRes.status === 'failed') {
          setError(finalRes.message || "AI optimization analysis failed.");
          toast.error("Falha na análise de otimização para IA", { description: finalRes.message });
        }
        
        setIsAnalyzing(false);
        analysisInProgressRef.current = false;
      }).catch((err) => {
        setError(err?.message || 'Erro na análise de otimização para IA');
        toast.error("Falha no polling da análise");
        
        setIsAnalyzing(false);
        analysisInProgressRef.current = false;
      });
    } catch (err: any) {
      setError(err.message || "Erro ao agendar análise de otimização para IA.");
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
    extractDomain
  };
}
