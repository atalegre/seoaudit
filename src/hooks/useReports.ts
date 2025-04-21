
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Report {
  id: string;
  url: string;
  created_at: string;
  status: string;
  content: Uint8Array | null;
  user_id?: string;
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
      
      // Convert string content to Uint8Array or null
      const typedReports = data?.map(report => ({
        ...report,
        content: report.content ? new Uint8Array(Buffer.from(report.content)) : null
      })) || [];
      
      setReports(typedReports);
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

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
  }, []);

  return {
    reports,
    isLoading,
    generateReport,
    refreshReports: fetchReports
  };
}
