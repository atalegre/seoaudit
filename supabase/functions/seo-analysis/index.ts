
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Get the PageSpeed API key from environment variable with the new name
const PAGESPEED_API_KEY = Deno.env.get('GOOGLE_PAGESPEED_API_KEY') || '';

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client using the environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const { url, strategy = 'mobile', userId = null } = await req.json();
    
    // Validate inputs
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if API key is configured
    if (!PAGESPEED_API_KEY) {
      console.error('PageSpeed API key not configured');
      return new Response(
        JSON.stringify({ 
          error: 'PageSpeed API key not configured on the server',
          details: 'Please configure GOOGLE_PAGESPEED_API_KEY in Supabase secrets'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Using API key: ${PAGESPEED_API_KEY.substring(0, 4)}...${PAGESPEED_API_KEY.substring(PAGESPEED_API_KEY.length - 4)}`);

    // Create a new record in seo_analysis_requests
    const { data: requestRecord, error: insertError } = await supabase
      .from('seo_analysis_requests')
      .insert({
        url,
        strategy,
        user_id: userId,
        is_guest: !userId,
        request_status: 'processing'
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Error creating request record:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to log request' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Normalize URL
    let normalizedUrl = url;
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    
    // Create PageSpeed API URL
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(normalizedUrl)}&key=${PAGESPEED_API_KEY}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo`;
    
    console.log(`Requesting PageSpeed API for ${normalizedUrl} with strategy ${strategy}`);
    
    // Call PageSpeed API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`PageSpeed API error: ${response.status} ${response.statusText}`, errorText);
      
      let detailedError = `PageSpeed API returned ${response.status}: ${response.statusText}`;
      let troubleshootingInfo = '';
      
      // Provide more helpful error messages based on status code
      if (response.status === 403) {
        troubleshootingInfo = 'API key may not be activated for PageSpeed Insights API. Enable it at https://console.cloud.google.com/apis/library/pagespeedonline.googleapis.com';
      } else if (response.status === 429) {
        troubleshootingInfo = 'API quota exceeded. Wait or increase quota limits.';
      } else if (response.status === 400) {
        troubleshootingInfo = 'Invalid request. URL may be malformed or inaccessible.';
      }
      
      // Update the request record with error status
      await supabase
        .from('seo_analysis_requests')
        .update({
          request_status: 'error',
          response_data: { 
            error: detailedError,
            troubleshooting: troubleshootingInfo,
            raw_error: errorText
          }
        })
        .eq('id', requestRecord.id);
      
      return new Response(
        JSON.stringify({ 
          error: detailedError,
          troubleshooting: troubleshootingInfo,
          requestId: requestRecord.id 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the response
    const data = await response.json();
    
    // Update the request record with success status and response data
    await supabase
      .from('seo_analysis_requests')
      .update({
        request_status: 'completed',
        response_data: data
      })
      .eq('id', requestRecord.id);
    
    // Return the results
    return new Response(
      JSON.stringify({ 
        data, 
        requestId: requestRecord.id,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in seo-analysis function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        stack: error.stack || 'No stack trace available'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
