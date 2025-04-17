
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SeoAnalysisRequest {
  id: string;
  url: string;
  created_at: string;
  strategy: string;
  request_status: string;
  is_guest: boolean;
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
      
      let query = supabase
        .from('seo_analysis_requests')
        .select('id, url, created_at, strategy, request_status, is_guest')
        .order('created_at', { ascending: false })
        .limit(20);
      
      // If user is logged in, get their requests, otherwise get recent guest requests
      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        query = query.eq('is_guest', true);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setHistory(data || []);
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
