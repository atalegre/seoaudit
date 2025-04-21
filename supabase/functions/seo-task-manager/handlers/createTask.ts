
import { supabase, corsHeaders } from "../utils.ts";

export async function createTask(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON body' }),
      { status: 400, headers: corsHeaders }
    );
  }

  // Accepts: { "task_name": string, "requested_data": { any } }
  const { task_name, requested_data, userId = null } = body;

  try {
    const insertObj: any = {
      user_id: userId, // can be null
      requested_values: requested_data,
      task_name: task_name,
      status: 'pending',
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert([insertObj])
      .select('id,status,requested_values,task_name,user_id,created_at,updated_at')
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      throw new Error('Could not create the task (insert returned no data)');
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Task scheduled successfully',
        taskId: data.id,
        status: data.status
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error creating task:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to schedule task' }),
      { status: 500, headers: corsHeaders }
    );
  }
}
