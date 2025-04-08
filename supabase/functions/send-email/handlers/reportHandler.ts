
import { corsHeaders } from "../cors.ts";
import { resend } from "../resendClient.ts";
import { EmailRequest, ReportEmailRequest } from "../types.ts";

// Handle report emails
export async function handleReportEmail(data: EmailRequest): Promise<Response> {
  const { email, name, reportUrl, seoScore, aioScore, websiteUrl } = data as ReportEmailRequest;

  // Validate required fields
  if (!email || !reportUrl || !websiteUrl) {
    throw new Error("Missing required fields: email, reportUrl, and websiteUrl are required");
  }

  console.log(`Sending report email to ${email} for ${websiteUrl}`);

  try {
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
  } catch (error: any) {
    console.error("Error sending report email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: "Error during report email sending"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
}
