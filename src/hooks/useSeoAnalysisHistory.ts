
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SeoAnalysisRequest {
  id: string;
  url: string;
  created_at: string;
  user_id?: string;
}

export function useSeoAnalysisHistory() {
  const [history, setHistory] = useState<SeoAnalysisRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Use 'tasks' table which is available in the database schema
      // and filter for tasks with task_name = 'seo_analysis'
      let query = supabase
        .from('tasks')
        .select('id, created_at, requested_values, user_id')
        .eq('task_name', 'seo_analysis')
        .order('created_at', { ascending: false })
        .limit(20);
      
      // If user is logged in, get their requests
      if (user) {
        query = query.eq('user_id', user.id);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) {
        throw fetchError;
      }
      
      if (!data) {
        setHistory([]);
        return;
      }
      
      // Convert data to match SeoAnalysisRequest type
      const typedData: SeoAnalysisRequest[] = data
        .filter(item => item && item.requested_values && typeof item.requested_values === 'object')
        .map(item => ({
          id: item.id,
          url: item.requested_values?.url || '',
          created_at: item.created_at,
          user_id: item.user_id
        }));
      
      setHistory(typedData);
    } catch (err: any) {
      console.error('Error fetching SEO analysis history:', err);
      setError(err.message || 'Failed to load analysis history');
      toast.error('Erro ao carregar histórico', {
        description: err.message || 'Não foi possível carregar o histórico de análises.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return {
    history,
    isLoading,
    error,
    refreshHistory: fetchHistory
  };
}
