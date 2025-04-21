
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./utils.ts";
import { createTask } from "./handlers/createTask.ts";
import { checkTaskStatus } from "./handlers/checkTaskStatus.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    if (req.method === 'POST' && path === 'create') {
      return await createTask(req);
    }

    if (req.method === 'GET' && path === 'status') {
      return await checkTaskStatus(req, url);
    }

    return new Response(
      JSON.stringify({ error: 'Unsupported route' }),
      { status: 400, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error in seo-task-manager function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    );
  }
});
