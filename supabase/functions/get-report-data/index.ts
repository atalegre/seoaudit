
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Required for CORS support
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse URL or body params
    let desktopTaskId, mobileTaskId, aiOptimizationTaskId;
    
    // Get params from query string or body
    if (req.method === "GET") {
      const url = new URL(req.url);
      desktopTaskId = url.searchParams.get("desktopTaskId");
      mobileTaskId = url.searchParams.get("mobileTaskId");
      aiOptimizationTaskId = url.searchParams.get("aiOptimizationTaskId");
    } else if (req.method === "POST") {
      const body = await req.json();
      desktopTaskId = body.desktopTaskId;
      mobileTaskId = body.mobileTaskId;
      aiOptimizationTaskId = body.aiOptimizationTaskId;
    }

    // Validate input
    if (!desktopTaskId || !mobileTaskId || !aiOptimizationTaskId) {
      return new Response(
        JSON.stringify({ 
          error: "Missing task IDs",
          details: "All three task IDs are required: desktopTaskId, mobileTaskId, aiOptimizationTaskId" 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get all three tasks in parallel for better performance
    const [desktopTaskResult, mobileTaskResult, aiOptTaskResult] = await Promise.all([
      supabase
        .from('tasks')
        .select('id, status, requested_values, response_values')
        .eq('id', desktopTaskId)
        .single(),
      supabase
        .from('tasks')
        .select('id, status, requested_values, response_values')
        .eq('id', mobileTaskId)
        .single(),
      supabase
        .from('tasks')
        .select('id, status, requested_values, response_values')
        .eq('id', aiOptimizationTaskId)
        .single()
    ]);

    // Check for errors in any of the queries
    const errors = [];
    if (desktopTaskResult.error) errors.push(`Desktop task error: ${desktopTaskResult.error.message}`);
    if (mobileTaskResult.error) errors.push(`Mobile task error: ${mobileTaskResult.error.message}`);
    if (aiOptTaskResult.error) errors.push(`AI optimization task error: ${aiOptTaskResult.error.message}`);

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch tasks", details: errors }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if all tasks are successful
    const desktopTask = desktopTaskResult.data;
    const mobileTask = mobileTaskResult.data;
    const aiOptTask = aiOptTaskResult.data;

    const notSuccessful = [];
    if (desktopTask.status !== 'success') notSuccessful.push(`Desktop task status: ${desktopTask.status}`);
    if (mobileTask.status !== 'success') notSuccessful.push(`Mobile task status: ${mobileTask.status}`);
    if (aiOptTask.status !== 'success') notSuccessful.push(`AI optimization task status: ${aiOptTask.status}`);

    if (notSuccessful.length > 0) {
      return new Response(
        JSON.stringify({ error: "Not all tasks are successful", details: notSuccessful }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get URL from any of the tasks for the report title
    let siteUrl = '';
    try {
      const requestedValues = typeof desktopTask.requested_values === 'string'
        ? JSON.parse(desktopTask.requested_values)
        : desktopTask.requested_values;
      
      siteUrl = requestedValues?.url || '';
    } catch (err) {
      console.error('Error parsing requested values:', err);
    }

    // Return the successful data
    return new Response(
      JSON.stringify({
        success: true,
        siteUrl,
        desktop: {
          id: desktopTask.id,
          data: desktopTask.response_values
        },
        mobile: {
          id: mobileTask.id,
          data: mobileTask.response_values
        },
        aiOptimization: {
          id: aiOptTask.id,
          data: aiOptTask.response_values
        }
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error in get-report-data function:', error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
