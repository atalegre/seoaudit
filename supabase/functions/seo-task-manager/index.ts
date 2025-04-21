
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
    
    // Handle task processing (triggered by cron or manually)
    if (req.method === 'POST' && path === 'process') {
      return await handleProcessTask(req);
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

// Function to create a new SEO analysis task
async function handleCreateTask(req: Request) {
  const { url, userId, frequency = 'once' } = await req.json();
  
  if (!url) {
    return new Response(
      JSON.stringify({ error: 'URL is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Calculate next run time (immediate for now)
  const nextRun = new Date();
  
  try {
    // Insert the task into the scheduled_tasks table
    const { data, error } = await supabase
      .from('scheduled_tasks')
      .insert({
        user_id: userId || null,
        url,
        frequency,
        next_run: nextRun.toISOString(),
        is_active: true
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Task scheduled successfully',
        taskId: data.id,
        status: 'pending',
        nextRun: data.next_run
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
    const token = authHeader?.split(' ')[1]; // Extract token from "Bearer <token>"
    
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
        .from('scheduled_tasks')
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
    
    // Get the task status and the latest SEO analysis data if available
    const { data: taskData, error: taskError } = await supabase
      .from('scheduled_tasks')
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
    
    // For completed tasks, get the analysis results
    if (taskData.status === 'success') {
      // Get the most recent analysis result for this URL
      const { data: analysisData, error: analysisError } = await supabase
        .from('analysis_results')
        .select('*')
        .eq('url', taskData.url)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (analysisError) throw analysisError;
      
      return new Response(
        JSON.stringify({
          status: taskData.status,
          taskId: taskData.id,
          url: taskData.url,
          lastRun: taskData.last_run,
          results: analysisData || null
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // For pending or in-progress tasks
    return new Response(
      JSON.stringify({
        status: taskData.status || 'pending',
        taskId: taskData.id,
        url: taskData.url,
        nextRun: taskData.next_run,
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

// Function to process a SEO analysis task
async function handleProcessTask(req: Request) {
  try {
    const { taskId } = await req.json();
    
    if (!taskId) {
      return new Response(
        JSON.stringify({ error: 'Task ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get task details
    const { data: taskData, error: taskError } = await supabase
      .from('scheduled_tasks')
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
    
    // Update task to in-progress
    const { error: updateError } = await supabase
      .from('scheduled_tasks')
      .update({
        status: 'in_progress',
        last_run: new Date().toISOString()
      })
      .eq('id', taskId);
    
    if (updateError) throw updateError;
    
    // Execute SEO analysis (call PageSpeed API)
    const url = taskData.url;
    
    // Normalize URL
    let normalizedUrl = url;
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    
    // For demonstration, we'll call PageSpeed API for actual data
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(normalizedUrl)}&key=${PAGESPEED_API_KEY}&strategy=mobile&category=performance&category=accessibility&category=best-practices&category=seo`;
    
    console.log(`Requesting PageSpeed API for ${normalizedUrl}`);
    
    // Call PageSpeed API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      // Update task status to failed
      await supabase
        .from('scheduled_tasks')
        .update({
          status: 'failed'
        })
        .eq('id', taskId);
      
      const errorText = await response.text();
      throw new Error(`PageSpeed API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    // Parse the response
    const data = await response.json();
    
    // Extract SEO score
    const seoScore = Math.round(data.lighthouseResult?.categories?.seo?.score * 100) || 0;
    
    // Calculate simplified AIO score (for demo purposes)
    // In a real scenario, you would call the OpenAI API or other analysis service
    const aioScore = Math.round(Math.random() * 30 + 50); // Random score between 50-80 for demo
    
    // Insert analysis results
    const { error: insertError } = await supabase
      .from('analysis_results')
      .insert({
        url: url,
        seo_data: data,
        aio_data: { score: aioScore, generated: true },
        seo_score: seoScore,
        aio_score: aioScore,
        overall_status: 'completed',
        client_id: null // This needs to be mapped to the right client if there is a relationship
      });
    
    if (insertError) throw insertError;
    
    // Update task status to success
    const { error: finalUpdateError } = await supabase
      .from('scheduled_tasks')
      .update({
        status: 'success',
        next_run: calculateNextRunTime(taskData.frequency)
      })
      .eq('id', taskId);
    
    if (finalUpdateError) throw finalUpdateError;
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Task processed successfully',
        taskId,
        seoScore,
        aioScore
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing task:', error);
    
    // Try to update task status to failed if possible
    try {
      const { taskId } = await req.json();
      if (taskId) {
        await supabase
          .from('scheduled_tasks')
          .update({
            status: 'failed'
          })
          .eq('id', taskId);
      }
    } catch (updateError) {
      console.error('Error updating task status:', updateError);
    }
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process task' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// Helper function to calculate next run time based on frequency
function calculateNextRunTime(frequency: string): string {
  const now = new Date();
  
  switch (frequency) {
    case 'hourly':
      now.setHours(now.getHours() + 1);
      break;
    case 'daily':
      now.setDate(now.getDate() + 1);
      break;
    case 'weekly':
      now.setDate(now.getDate() + 7);
      break;
    case 'monthly':
      now.setMonth(now.getMonth() + 1);
      break;
    default:
      // For 'once' or unknown frequencies, set far future date
      now.setFullYear(now.getFullYear() + 100);
  }
  
  return now.toISOString();
}
