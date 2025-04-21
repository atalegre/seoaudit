
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client using environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Hardcoded token for API access for demo purposes - replace with proper auth or API key management
const PAGESPEED_API_KEY = Deno.env.get('GOOGLE_PAGESPEED_API_KEY') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    // Handle task creation
    if (req.method === 'POST' && path === 'create') {
      return await handleCreateTask(req);
    }

    // Handle task status check
    if (req.method === 'GET' && path === 'status') {
      return await handleCheckStatus(req, url);
    }

    return new Response(
      JSON.stringify({ error: 'Unsupported route' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in seo-task-manager function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Function to create a new SEO analysis task using the "tasks" table
async function handleCreateTask(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON body' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { url, userId = null, frequency = 'once' } = body;

  if (!url) {
    return new Response(
      JSON.stringify({ error: 'URL is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Insert the task into the "tasks" table: required fields only, plus frequency inside requested_values
    const requested_values = { url, frequency };
    const insertObj: any = {
      user_id: userId, // can be null
      requested_values: requested_values,
      status: 'pending',
      // response_values: null (let DB default be null)
      // created_at, updated_at handled by DB defaults
    };

    // Insert and get back the inserted row
    const { data, error } = await supabase
      .from('tasks')
      .insert([insertObj])
      .select('id,status,requested_values,user_id,created_at,updated_at')
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
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating task:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to schedule task' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// Function to check the status of a SEO analysis task ("tasks" table)
async function handleCheckStatus(req: Request, url: URL) {
  const taskId = url.searchParams.get('taskId');

  if (!taskId) {
    return new Response(
      JSON.stringify({ error: 'Task ID is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Get task details from "tasks" table
    const { data: taskData, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .maybeSingle();

    if (taskError) throw taskError;

    if (!taskData) {
      return new Response(
        JSON.stringify({ error: 'Task not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the auth token from request headers to check user identity
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    // If user is not authenticated (guest)
    if (!token) {
      // Guest can only access tasks not associated with a user
      if (taskData.user_id) {
        return new Response(
          JSON.stringify({ error: 'Access denied' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // If user is authenticated, verify their identity
      const { data: authResult, error: authError } = await supabase.auth.getUser(token);

      if (authError) {
        console.error('Error authenticating user:', authError);
        return new Response(
          JSON.stringify({ error: 'Authentication failed' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const user = authResult?.user;
      // Authenticated user can only access their own tasks
      if (taskData.user_id && taskData.user_id !== user?.id) {
        return new Response(
          JSON.stringify({ error: 'Access denied' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // If access is granted, return task details according to DB schema
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

    return new Response(
      JSON.stringify(responseObj),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error checking task status:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to check task status' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
