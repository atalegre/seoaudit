
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

// Define interface for confirmation email request
interface ConfirmationEmailRequest {
  type: 'confirmation';
  email: string;
  name: string;
  confirmationUrl: string;
}

// Define interface for report email request
interface ReportEmailRequest {
  type: 'report';
  email: string;
  name: string;
  reportUrl: string;
  seoScore: number;
  aioScore: number;
  websiteUrl: string;
}

// Type union for all email request types
type EmailRequest = ContactRequest | ConfirmationEmailRequest | ReportEmailRequest;

// Main request handler
const handler = async (req: Request): Promise<Response> => {
  console.log("Email function called with method:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const requestData = await req.json();
    console.log("Request data received:", JSON.stringify(requestData));
    
    // Determine the type of email to send
    if (requestData.type === 'confirmation') {
      return await sendConfirmationEmail(requestData as ConfirmationEmailRequest);
    } else if (requestData.type === 'report') {
      return await sendReportEmail(requestData as ReportEmailRequest);
    } else {
      // Default to contact form email
      return await sendContactEmail(requestData as ContactRequest);
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

// Handle contact form emails
async function sendContactEmail(data: ContactRequest): Promise<Response> {
  const { name, email, message, subject = "Nova mensagem do website" } = data;

  // Validate required fields
  if (!name || !email || !message) {
    throw new Error("Missing required fields: name, email and message are required");
  }

  // Send email using Resend
  const emailResponse = await resend.emails.send({
    from: "SEOAudit <no-reply@seoaudit.pt>", // Make sure to use a verified domain
    to: ["contacto@seoaudit.pt"], // Update with the real company email
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
    reply_to: email,
  });

  console.log("Contact email sent successfully:", emailResponse);
  return new Response(
    JSON.stringify({ success: true, message: "Email enviado com sucesso" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    }
  );
}

// Handle account confirmation emails
async function sendConfirmationEmail(data: ConfirmationEmailRequest): Promise<Response> {
  const { email, name, confirmationUrl } = data;

  // Validate required fields
  if (!email || !confirmationUrl) {
    throw new Error("Missing required fields: email and confirmationUrl are required");
  }

  console.log(`Sending confirmation email to ${email} with URL ${confirmationUrl}`);

  try {
    // Try sending with different subjects to avoid spam filters
    const subjectOptions = [
      "Confirme a sua conta SEOAudit",
      "Verificação da sua conta SEOAudit",
      "Complete o seu registo SEOAudit"
    ];
    
    const selectedSubject = subjectOptions[Math.floor(Math.random() * subjectOptions.length)];
    
    // Send confirmation email using Resend with more robust formatting
    const emailResponse = await resend.emails.send({
      from: "SEOAudit <no-reply@seoaudit.pt>", // Make sure to use a verified domain
      to: [email],
      subject: selectedSubject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #4F46E5; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">SEOAudit</h1>
          </div>
          
          <div style="padding: 20px; border: 1px solid #e1e1e1; border-top: none; background-color: #ffffff;">
            <h2 style="color: #4F46E5;">Bem-vindo à SEOAudit${name ? ', ' + name : ''}!</h2>
            
            <p>Obrigado por se registar na nossa plataforma. Para começar a utilizar todos os nossos serviços, confirme a sua conta clicando no botão abaixo:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                Confirmar a minha conta
              </a>
            </div>
            
            <p>Se o botão acima não funcionar, pode copiar e colar o seguinte link no seu navegador:</p>
            <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px;"><a href="${confirmationUrl}">${confirmationUrl}</a></p>
            
            <p>Este link expira em 24 horas.</p>
            
            <p style="margin-top: 30px;">Cumprimentos,<br>A equipa SEOAudit</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e1e1e1; font-size: 12px; color: #888;">
              <p>Se não solicitou a criação de uma conta, ignore este email.</p>
              <p>Não responda a este email. Foi enviado a partir de um endereço que não é monitorizado.</p>
              <p>© SEOAudit 2025. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Confirmation email sent successfully:", emailResponse);
    return new Response(
      JSON.stringify({ success: true, message: "Email de confirmação enviado com sucesso" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw error;
  }
}

// Handle report emails
async function sendReportEmail(data: ReportEmailRequest): Promise<Response> {
  const { email, name, reportUrl, seoScore, aioScore, websiteUrl } = data;

  // Validate required fields
  if (!email || !reportUrl || !websiteUrl) {
    throw new Error("Missing required fields: email, reportUrl, and websiteUrl are required");
  }

  // Send report email using Resend
  const emailResponse = await resend.emails.send({
    from: "SEOAudit <no-reply@seoaudit.pt>", // Make sure to use a verified domain
    to: [email],
    subject: `O seu relatório SEO para ${websiteUrl} está pronto!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>O seu relatório SEO está pronto!</h2>
        
        <p>Olá${name ? ' ' + name : ''},</p>
        
        <p>O relatório da análise SEO para o site <strong>${websiteUrl}</strong> já está disponível.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <div style="margin-bottom: 15px;">
            <p style="font-weight: bold; margin-bottom: 5px;">Pontuação SEO</p>
            <div style="background-color: #e0e0e0; border-radius: 10px; height: 10px; overflow: hidden;">
              <div style="background-color: ${seoScore > 70 ? '#4CAF50' : seoScore > 40 ? '#FFC107' : '#F44336'}; height: 100%; width: ${seoScore}%;"></div>
            </div>
            <p style="text-align: right; margin-top: 5px;">${seoScore}/100</p>
          </div>
          
          <div>
            <p style="font-weight: bold; margin-bottom: 5px;">Pontuação AIO</p>
            <div style="background-color: #e0e0e0; border-radius: 10px; height: 10px; overflow: hidden;">
              <div style="background-color: ${aioScore > 70 ? '#4CAF50' : aioScore > 40 ? '#FFC107' : '#F44336'}; height: 100%; width: ${aioScore}%;"></div>
            </div>
            <p style="text-align: right; margin-top: 5px;">${aioScore}/100</p>
          </div>
        </div>
        
        <p>Para ver o relatório completo e obter recomendações detalhadas sobre como melhorar o SEO do seu site, clique no botão abaixo:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${reportUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Ver relatório completo
          </a>
        </div>
        
        <p>Se o botão acima não funcionar, pode copiar e colar o seguinte link no seu navegador:</p>
        <p><a href="${reportUrl}">${reportUrl}</a></p>
        
        <p style="margin-top: 30px;">Cumprimentos,<br>A equipa SEOAudit</p>
      </div>
    `,
  });

  console.log("Report email sent successfully:", emailResponse);
  return new Response(
    JSON.stringify({ success: true, message: "Email com relatório enviado com sucesso" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    }
  );
}

// Start the server
serve(handler);
