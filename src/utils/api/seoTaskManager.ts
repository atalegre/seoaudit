
import { supabase } from '@/integrations/supabase/client';

interface CreateTaskParams {
  url: string;
  platform?: string;
  task_name?: string; // Added task_name parameter
}

interface TaskStatusResponse {
  status: 'pending' | 'in_progress' | 'success' | 'failed';
  taskId: string;
  url: string;
  results?: any;
  nextRun?: string;
  lastRun?: string;
  message?: string;
}

/**
 * Create a new SEO analysis task
 */
export async function createSeoAnalysisTask(params: CreateTaskParams) : Promise<{ taskId: string }> {
  try {
    // Prepare requested_data ONLY with expected keys
    const requested_data: any = { url: params.url };
    if (params.platform) requested_data.platform = params.platform;

    const { data, error } = await supabase.functions.invoke('seo-task-manager/create', {
      method: 'POST',
      body: {
        task_name: params.task_name || 'seo_analysis', // Use provided task_name or default to 'seo_analysis'
        requested_data
      }
    });

    if (error) throw error;
    return { taskId: data.taskId };
  } catch (error) {
    console.error('Error creating SEO analysis task:', error);
    throw error;
  }
}

/**
 * Check the status of an SEO analysis task
 */
export async function checkSeoAnalysisTaskStatus(taskId: string): Promise<TaskStatusResponse> {
  try {
    // Pass the taskId as a query param in the URL (not in body)
    const { data, error } = await supabase.functions.invoke(`seo-task-manager/status?taskId=${encodeURIComponent(taskId)}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json'
      }
    });

    if (error) throw error;
    
    // Log the raw data structure from the API to better understand the format
    console.log(`Raw API response for task ${taskId}:`, data);
    
    // Ensure we have the expected data structure
    if (data && data.results && typeof data.results === 'object') {
      console.log(`Task ${taskId} result keys:`, Object.keys(data.results));
    }
    
    return data;
  } catch (error) {
    console.error('Error checking SEO analysis task status:', error);
    throw error;
  }
}

/**
 * Process an SEO analysis task (typically called by a scheduler or admin)
 */
export async function processSeoAnalysisTask(taskId: string): Promise<{ success: boolean }> {
  try {
    const { data, error } = await supabase.functions.invoke('seo-task-manager/process', {
      method: 'POST',
      body: { taskId }
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error processing SEO analysis task:', error);
    throw error;
  }
}

/**
 * Poll for task status until it's completed or failed
 * @param taskId The ID of the task to poll
 * @param onStatusChange Callback for status changes
 * @param maxAttempts Maximum number of polling attempts
 * @param interval Interval between polling attempts in milliseconds
 */
export async function pollTaskUntilComplete(
  taskId: string,
  onStatusChange?: (status: TaskStatusResponse) => void,
  maxAttempts = 60, // 5 minutes with 5-second interval
  interval = 5000
): Promise<TaskStatusResponse> {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const checkStatus = async () => {
      try {
        if (attempts >= maxAttempts) {
          reject(new Error('Task polling timed out'));
          return;
        }

        attempts++;
        const response = await checkSeoAnalysisTaskStatus(taskId);
        
        // Validate and log the response
        console.log(`Poll attempt ${attempts} for task ${taskId} - Status: ${response.status}`);
        
        if (response.results) {
          console.log(`Poll received results for task ${taskId}:`, 
            typeof response.results === 'object' ? 
              `Object with keys: ${Object.keys(response.results).join(', ')}` : 
              `${typeof response.results}`
          );
        }

        // Notify about status change
        if (onStatusChange) {
          onStatusChange(response);
        }

        if (response.status === 'success' || response.status === 'failed') {
          // Final validation check for success case
          if (response.status === 'success' && (!response.results || typeof response.results !== 'object')) {
            console.warn(`Task ${taskId} reported success but has invalid results:`, response.results);
            // Still resolve with what we have
          }
          resolve(response);
          return;
        }

        // Continue polling
        setTimeout(checkStatus, interval);
      } catch (error) {
        console.error('Error during task polling:', error);
        reject(error);
      }
    };

    // Start polling
    checkStatus();
  });
}
