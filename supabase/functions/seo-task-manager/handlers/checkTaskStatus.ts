
import { supabase, corsHeaders, getAuthToken } from "../utils.ts";

export async function checkTaskStatus(req: Request, url: URL) {
  // We're now expecting taskId to be either in URL params or in the body
  let taskId = url.searchParams.get('taskId');
  
  // If not in URL params, try to get from body for POST requests
  if (!taskId && req.method === 'POST') {
    try {
      const body = await req.json();
      taskId = body.taskId;
    } catch (e) {
      // If JSON parsing fails, handle gracefully
      console.error("Failed to parse request body:", e);
    }
  }

  if (!taskId) {
    return new Response(
      JSON.stringify({ error: 'Task ID is required' }),
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const { data: taskData, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .maybeSingle();

    if (taskError) throw taskError;

    if (!taskData) {
      return new Response(
        JSON.stringify({ error: 'Task not found' }),
        { status: 404, headers: corsHeaders }
      );
    }

    const token = getAuthToken(req);
    if (taskData.user_id) {
      if (token) {
        const { data: authResult, error: authError } = await supabase.auth.getUser(token);
        if (authError || !authResult?.user || authResult.user.id !== taskData.user_id) {
          return new Response(
            JSON.stringify({ error: 'Access denied' }),
            { status: 403, headers: corsHeaders }
          );
        }
      } else {
        return new Response(
          JSON.stringify({ error: 'Authentication required for this task' }),
          { status: 401, headers: corsHeaders }
        );
      }
    }

    let responseObj: any = {
      status: taskData.status,
      taskId: taskData.id,
      url: taskData.requested_values?.url ?? undefined,
      lastRun: taskData.updated_at,
    };

    if (taskData.status === 'success') {
      responseObj.results = taskData.response_values ?? null;
    } else if (taskData.status === 'failed') {
      responseObj.message = taskData.response_values?.error || "Task failed.";
    } else {
      responseObj.message = taskData.status === 'pending' ? 'Task is queued' : 'Task is being processed';
    }

    return new Response(JSON.stringify(responseObj), { headers: corsHeaders });
  } catch (error) {
    console.error('Error checking task status:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to check task status' }),
      { status: 500, headers: corsHeaders }
    );
  }
}
