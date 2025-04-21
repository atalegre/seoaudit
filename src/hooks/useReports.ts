
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Report {
  id: string;
  url: string;
  created_at: string;
  status: string;
  content: Uint8Array | null;
}

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async (url: string) => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert([{ url, status: 'pending' }])
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
  }, []);

  return {
    reports,
    isLoading,
    generateReport,
    refreshReports: fetchReports
  };
}
