
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Set up CORS headers
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

// Create a Supabase client using environment variables
export const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
export const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const getAuthToken = (req: Request) => {
  const authHeader = req.headers.get('Authorization');
  return authHeader?.split(' ')[1];
};
