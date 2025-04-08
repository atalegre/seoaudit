
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./cors.ts";
import { handleContactEmail } from "./handlers/contactHandler.ts";
import { handleConfirmationEmail } from "./handlers/confirmationHandler.ts";
import { handleReportEmail } from "./handlers/reportHandler.ts";
import { EmailRequest } from "./types.ts";

// Main request handler
const handler = async (req: Request): Promise<Response> => {
  console.log("Email function called with method:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if RESEND_API_KEY is available
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY environment variable is not set");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Resend API key is not configured on the server" 
        }),
        {
          status: 500,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          },
        }
      );
    }

    // Parse request body
    const requestData = await req.json();
    console.log("Request data received:", JSON.stringify(requestData));
    
    // Determine the type of email to send
    if (requestData.type === 'confirmation') {
      return await handleConfirmationEmail(requestData as EmailRequest);
    } else if (requestData.type === 'report') {
      return await handleReportEmail(requestData as EmailRequest);
    } else {
      // Default to contact form email
      return await handleContactEmail(requestData as EmailRequest);
    }
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 400,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        },
      }
    );
  }
};

// Start the server
serve(handler);
