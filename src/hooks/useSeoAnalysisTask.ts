
import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import { createSeoAnalysisTask, checkSeoAnalysisTaskStatus, pollTaskUntilComplete } from '@/utils/api/seoTaskManager';
import { toast } from 'sonner';

interface SeoAnalysisTaskResult {
  taskId: string | null;
  status: 'idle' | 'pending' | 'in_progress' | 'success' | 'failed';
  results: any | null;
  url: string | null;
  error: string | null;
}

export function useSeoAnalysisTask() {
  const { user } = useUser();
  const [analysisState, setAnalysisState] = useState<SeoAnalysisTaskResult>({
    taskId: null,
    status: 'idle',
    results: null,
    url: null,
    error: null
  });
  const [isPolling, setIsPolling] = useState(false);

  // Cancel polling on unmount
  useEffect(() => {
    return () => {
      setIsPolling(false);
    };
  }, []);

  const startAnalysis = useCallback(async (url: string, frequency: 'once' | 'daily' | 'weekly' | 'monthly' = 'once') => {
    try {
      setAnalysisState({
        taskId: null,
        status: 'pending',
        results: null,
        url,
        error: null
      });

      // Normalize URL
      let normalizedUrl = url;
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = 'https://' + normalizedUrl;
      }

      // Store URL in localStorage for persistence
      localStorage.setItem('lastAnalyzedUrl', normalizedUrl);

      toast.info("Iniciando análise", {
        description: "A análise pode demorar alguns minutos."
      });

      // Create task
      const { taskId } = await createSeoAnalysisTask({
        url: normalizedUrl,
        userId: user?.id || null,
        frequency
      });

      setAnalysisState(prev => ({
        ...prev,
        taskId,
        status: 'pending'
      }));

      // Start polling
      setIsPolling(true);
      pollTaskUntilComplete(
        taskId,
        (statusUpdate) => {
          // Update state based on status
          setAnalysisState(prev => ({
            ...prev,
            status: statusUpdate.status as any,
            results: statusUpdate.results || null
          }));

          // Show toast notifications for status changes
          if (statusUpdate.status === 'in_progress' && prev.status !== 'in_progress') {
            toast.info("Análise em progresso", {
              description: "Estamos processando os dados do seu site."
            });
          } else if (statusUpdate.status === 'success') {
            toast.success("Análise concluída", {
              description: "Os resultados da sua análise estão prontos."
            });
          } else if (statusUpdate.status === 'failed') {
            toast.error("Falha na análise", {
              description: statusUpdate.message || "Ocorreu um erro ao analisar o site."
            });
            setAnalysisState(prev => ({
              ...prev,
              error: statusUpdate.message || "Ocorreu um erro ao analisar o site."
            }));
          }
        }
      ).then((finalResult) => {
        setIsPolling(false);
        if (finalResult.status === 'success') {
          setAnalysisState({
            taskId,
            status: 'success',
            results: finalResult.results,
            url: normalizedUrl,
            error: null
          });
        } else {
          setAnalysisState({
            taskId,
            status: 'failed',
            results: null,
            url: normalizedUrl,
            error: finalResult.message || "Análise falhou"
          });
        }
      }).catch((error) => {
        setIsPolling(false);
        console.error("Error during polling:", error);
        setAnalysisState({
          taskId,
          status: 'failed',
          results: null,
          url: normalizedUrl,
          error: error.message
        });
        toast.error("Erro na análise", {
          description: error.message || "Ocorreu um erro durante a análise."
        });
      });
    } catch (error: any) {
      console.error("Error starting analysis:", error);
      setAnalysisState({
        taskId: null,
        status: 'failed',
        results: null,
        url,
        error: error.message
      });
      toast.error("Erro ao iniciar análise", {
        description: error.message || "Não foi possível iniciar a análise."
      });
    }
  }, [user]);

  const checkTaskStatus = useCallback(async (taskId: string) => {
    try {
      const result = await checkSeoAnalysisTaskStatus(taskId);
      setAnalysisState({
        taskId,
        status: result.status as any,
        results: result.results || null,
        url: result.url,
        error: null
      });
      return result;
    } catch (error: any) {
      console.error("Error checking task status:", error);
      setAnalysisState(prev => ({
        ...prev,
        status: 'failed',
        error: error.message
      }));
      throw error;
    }
  }, []);

  // Function to resume analysis from a stored task ID
  const resumeAnalysis = useCallback(async (taskId: string) => {
    try {
      setAnalysisState({
        taskId,
        status: 'pending',
        results: null,
        url: null,
        error: null
      });

      // Check current status
      const statusResult = await checkTaskStatus(taskId);
      
      // If already completed, just update state
      if (statusResult.status === 'success' || statusResult.status === 'failed') {
        return;
      }
      
      // Otherwise start polling
      setIsPolling(true);
      pollTaskUntilComplete(
        taskId,
        (statusUpdate) => {
          setAnalysisState(prev => ({
            ...prev,
            status: statusUpdate.status as any,
            url: statusUpdate.url,
            results: statusUpdate.results || null
          }));
        }
      ).then((finalResult) => {
        setIsPolling(false);
        if (finalResult.status === 'success') {
          setAnalysisState({
            taskId,
            status: 'success',
            results: finalResult.results,
            url: finalResult.url,
            error: null
          });
        } else {
          setAnalysisState({
            taskId,
            status: 'failed',
            results: null,
            url: finalResult.url,
            error: finalResult.message || "Análise falhou"
          });
        }
      }).catch((error) => {
        setIsPolling(false);
        console.error("Error during polling:", error);
        setAnalysisState(prev => ({
          ...prev,
          status: 'failed',
          error: error.message
        }));
      });
    } catch (error: any) {
      console.error("Error resuming analysis:", error);
      setAnalysisState(prev => ({
        ...prev,
        status: 'failed',
        error: error.message
      }));
    }
  }, [checkTaskStatus]);

  return {
    analysisState,
    startAnalysis,
    checkTaskStatus,
    resumeAnalysis,
    isAnalyzing: ['pending', 'in_progress'].includes(analysisState.status)
  };
}
