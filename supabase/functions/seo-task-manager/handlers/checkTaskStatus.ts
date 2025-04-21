
import { supabase, corsHeaders, getAuthToken } from "../utils.ts";

export async function checkTaskStatus(req: Request, url: URL) {
  const taskId = url.searchParams.get('taskId');

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

    // Guest (no auth)
    if (!token) {
      if (taskData.user_id) {
        return new Response(
          JSON.stringify({ error: 'Access denied' }),
          { status: 403, headers: corsHeaders }
        );
      }
    } else {
      const { data: authResult, error: authError } = await supabase.auth.getUser(token);
      if (authError) {
        console.error('Error authenticating user:', authError);
        return new Response(
          JSON.stringify({ error: 'Authentication failed' }),
          { status: 401, headers: corsHeaders }
        );
      }
      const user = authResult?.user;
      if (taskData.user_id && taskData.user_id !== user?.id) {
        return new Response(
          JSON.stringify({ error: 'Access denied' }),
          { status: 403, headers: corsHeaders }
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
