
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Report {
  id: string;
  url: string;
  created_at: string;
  status: string; // Using 'string' to allow for 'success', 'pending', 'failed'
  file_url: string | null;
  user_id?: string;
}

export function useReports(autoRefresh = false, refreshInterval = 5000) {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef<number | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setReports(data || []);
      return data;
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startAutoRefresh = useCallback(() => {
    if (!autoRefresh) return;
    
    // Clear any existing timer
    if (refreshTimerRef.current) {
      window.clearInterval(refreshTimerRef.current);
    }
    
    // Set up new timer
    refreshTimerRef.current = window.setInterval(() => {
      fetchReports();
    }, refreshInterval);
    
    return () => {
      if (refreshTimerRef.current) {
        window.clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [autoRefresh, refreshInterval, fetchReports]);

  const stopAutoRefresh = useCallback(() => {
    if (refreshTimerRef.current) {
      window.clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const generateReport = async (url: string) => {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to generate reports');
        throw new Error('User not authenticated');
      }

      // Insert with user_id from the authenticated user
      const { data, error } = await supabase
        .from('reports')
        .insert({
          url, 
          status: 'pending',
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Report generation started');
      await fetchReports();
      return data;
    } catch (error: any) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
      throw error;
    }
  };

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    if (autoRefresh) {
      const cleanup = startAutoRefresh();
      return cleanup;
    }
  }, [autoRefresh, startAutoRefresh]);

  return {
    reports,
    isLoading,
    generateReport,
    refreshReports: fetchReports,
    startAutoRefresh,
    stopAutoRefresh
  };
}
