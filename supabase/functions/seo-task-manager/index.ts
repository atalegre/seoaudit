
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

// Function to create a new SEO analysis task (uses new tasks table)
async function handleCreateTask(req: Request) {
  const { url, userId, frequency = 'once' } = await req.json();

  if (!url) {
    return new Response(
      JSON.stringify({ error: 'URL is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Insert the task into the new tasks table (frequency included in requested_values)
    const requested_values = { url, frequency };
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: userId || null,
        requested_values,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

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

// Function to check the status of a SEO analysis task
async function handleCheckStatus(req: Request, url: URL) {
  const taskId = url.searchParams.get('taskId');

  if (!taskId) {
    return new Response(
      JSON.stringify({ error: 'Task ID is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Get the auth token from request headers to check user identity (if available)
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    // If token exists, validate user access to this task
    if (token) {
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError) {
        return new Response(
          JSON.stringify({ error: 'Authentication failed' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      // Check if task belongs to this user
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

      if (taskData.user_id && taskData.user_id !== user?.id) {
        return new Response(
          JSON.stringify({ error: 'Access denied' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Get the task status and latest response values if available
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

    // If task completed and response_values present, include details
    if (taskData.status === 'success') {
      // Parsing for demo: results in response_values.seo_data and aio_data
      let results = null;
      try {
        results = taskData.response_values ?? null;
      } catch (e) {
        results = null;
      }

      return new Response(
        JSON.stringify({
          status: taskData.status,
          taskId: taskData.id,
          url: taskData.requested_values?.url ?? undefined,
          lastRun: taskData.updated_at,
          results: results
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For pending or in-progress tasks
    return new Response(
      JSON.stringify({
        status: taskData.status || 'pending',
        taskId: taskData.id,
        url: taskData.requested_values?.url ?? undefined,
        message: taskData.status === 'pending' ? 'Task is queued' : 'Task is being processed'
      }),
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
