
import { corsHeaders, supabase } from "../utils.ts";

export const createTask = async (req: Request) => {
  try {
    const { task_name, requested_data } = await req.json();

    if (!task_name || !requested_data) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Create a new task in the database
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          task_name,
          requested_values: requested_data,
          status: 'pending',
          response_values: null,
          // user_id is optional in the tasks table
          user_id: null
        }
      ])
      .select('id')
      .single();

    if (error) {
      console.error('Error creating task:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ taskId: data.id }),
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error in createTask function:', error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: corsHeaders }
    );
  }
};
