
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TaskData {
  id: string;
  data: any;
}

interface ReportData {
  siteUrl: string;
  desktop: TaskData;
  mobile: TaskData;
  aiOptimization: TaskData;
}

export function useReportData(
  desktopTaskId?: string,
  mobileTaskId?: string,
  aiOptimizationTaskId?: string
) {
  const [data, setData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportData = async () => {
      if (!desktopTaskId || !mobileTaskId || !aiOptimizationTaskId) {
        setError('Missing one or more required task IDs');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Use params property instead of queryParams for compatibility with Supabase SDK
        const { data: reportData, error: fetchError } = await supabase.functions.invoke(
          'get-report-data',
          {
            method: 'GET',
            params: {
              desktopTaskId,
              mobileTaskId,
              aiOptimizationTaskId
            }
          }
        );

        if (fetchError) {
          throw new Error(fetchError.message || 'Error fetching report data');
        }

        if (!reportData || reportData.error) {
          throw new Error(
            reportData?.error || 
            reportData?.details?.join(', ') || 
            'Failed to retrieve report data'
          );
        }

        console.log('Report data retrieved successfully:', reportData);
        setData(reportData);
      } catch (err: any) {
        console.error('Error in useReportData hook:', err);
        setError(err.message || 'An unexpected error occurred');
        toast.error('Failed to load report data', {
          description: err.message || 'Please check if the task IDs are correct and try again.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [desktopTaskId, mobileTaskId, aiOptimizationTaskId]);

  return {
    data,
    isLoading,
    error
  };
}
