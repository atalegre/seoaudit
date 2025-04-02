
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Initialize Resend with the API key from environment variables
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Setup CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Define interface for contact form request
interface ContactRequest {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

// Main request handler
const handler = async (req: Request): Promise<Response> => {
  console.log("Email function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const requestData = await req.json();
    console.log("Request data:", requestData);
    
    const { name, email, message, subject = "Nova mensagem do website" }: ContactRequest = requestData;

    // Validate required fields
    if (!name || !email || !message) {
      throw new Error("Missing required fields: name, email and message are required");
    }

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "SEOAudit <no-reply@seu-dominio-configurado-no-resend.com>", // Update with your verified domain
      to: ["seu-email-de-contato@example.com"], // Update with your contact email
      subject: subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Nova mensagem de contacto</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mensagem:</strong></p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p style="color: #888; margin-top: 30px; font-size: 12px;">
            Este email foi enviado automaticamente pelo formulário de contacto do SEOAudit.
          </p>
        </div>
      `,
      // Optional: Send a copy to the sender
      reply_to: email,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email enviado com sucesso"
      }),
      {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        },
      }
    );
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
