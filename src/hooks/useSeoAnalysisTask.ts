
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const statusRef = useRef<string>(analysisState.status);

  useEffect(() => {
    statusRef.current = analysisState.status;
  }, [analysisState.status]);

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

      let normalizedUrl = url;
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = 'https://' + normalizedUrl;
      }

      localStorage.setItem('lastAnalyzedUrl', normalizedUrl);

      toast.info("Iniciando análise", {
        description: "A análise pode demorar alguns minutos."
      });

      const { taskId } = await createSeoAnalysisTask({
        url: normalizedUrl,
        userId: user?.id || null,
        platform: 'desktop' // Specify platform for the analysis
      });

      setAnalysisState(prev => ({
        ...prev,
        taskId,
        status: 'pending'
      }));

      statusRef.current = 'pending';

      setIsPolling(true);
      pollTaskUntilComplete(
        taskId,
        (statusUpdate) => {
          // Handle explicit failure status from API
          if (statusUpdate.status === 'failure') {
            toast.error("A análise falhou. Por favor, tente novamente mais tarde.", {
              description: statusUpdate.message || "Task is being processed. Tente novamente em alguns minutos."
            });
            setAnalysisState(prev => ({
              ...prev,
              status: 'failed',
              results: null,
              error: "A análise falhou. Por favor, tente novamente mais tarde."
            }));
            setIsPolling(false);
            statusRef.current = 'failed';
            return;
          }

          setAnalysisState(prev => ({
            ...prev,
            status: statusUpdate.status as any,
            results: statusUpdate.results || null
          }));

          if (statusUpdate.status === 'in_progress' && statusRef.current !== 'in_progress') {
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
          statusRef.current = statusUpdate.status as string;
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
        } else if (finalResult.status === 'failure') {
          setAnalysisState({
            taskId,
            status: 'failed',
            results: null,
            url: normalizedUrl,
            error: "A análise falhou. Por favor, tente novamente mais tarde."
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
      // Explicitly check for 'failure' status and show user-friendly error
      if (result.status === 'failure') {
        setAnalysisState({
          taskId,
          status: 'failed',
          results: null,
          url: result.url,
          error: "A análise falhou. Por favor, tente novamente mais tarde."
        });
        toast.error("A análise falhou. Por favor, tente novamente mais tarde.", {
          description: result.message || "Task is being processed. Tente novamente em alguns minutos."
        });
        return result;
      }
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

  const resumeAnalysis = useCallback(async (taskId: string) => {
    try {
      setAnalysisState({
        taskId,
        status: 'pending',
        results: null,
        url: null,
        error: null
      });

      const statusResult = await checkTaskStatus(taskId);

      // If explicit failure, don't attempt to poll further
      if (statusResult.status === 'success' || statusResult.status === 'failed' || statusResult.status === 'failure') {
        return;
      }

      setIsPolling(true);
      pollTaskUntilComplete(
        taskId,
        (statusUpdate) => {
          // Handle failure here as well
          if (statusUpdate.status === 'failure') {
            setAnalysisState(prev => ({
              ...prev,
              status: 'failed',
              results: null,
              error: "A análise falhou. Por favor, tente novamente mais tarde."
            }));
            toast.error("A análise falhou. Por favor, tente novamente mais tarde.", {
              description: statusUpdate.message || "Task is being processed. Tente novamente em alguns minutos."
            });
            setIsPolling(false);
            return;
          }
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
        } else if (finalResult.status === 'failure') {
          setAnalysisState({
            taskId,
            status: 'failed',
            results: null,
            url: finalResult.url,
            error: "A análise falhou. Por favor, tente novamente mais tarde."
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
