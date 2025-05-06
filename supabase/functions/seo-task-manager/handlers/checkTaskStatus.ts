
import { corsHeaders, supabase } from "../utils.ts";

export const checkTaskStatus = async (req: Request, url: URL) => {
  try {
    // Get task ID from query parameters
    const taskId = url.searchParams.get('taskId');

    if (!taskId) {
      return new Response(
        JSON.stringify({ error: "Missing taskId parameter" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Check task status in the database
    const { data, error } = await supabase
      .from('tasks')
      .select('id, status, requested_values, response_values, updated_at')
      .eq('id', taskId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching task:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: corsHeaders }
      );
    }

    if (!data) {
      return new Response(
        JSON.stringify({ error: "Task not found" }),
        { status: 404, headers: corsHeaders }
      );
    }

    // Extract URL from requested_values if available
    let url = '';
    try {
      const requestedValues = typeof data.requested_values === 'object' 
        ? data.requested_values 
        : JSON.parse(data.requested_values as string);
      
      url = requestedValues?.url || '';
    } catch (err) {
      console.error('Error parsing requested values:', err);
    }

    const response = {
      status: data.status,
      taskId: data.id,
      url,
      results: data.response_values,
      lastRun: data.updated_at,
      message: data.status === 'failed' ? 'Task processing failed' : undefined
    };

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error in checkTaskStatus function:', error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: corsHeaders }
    );
  }
};
