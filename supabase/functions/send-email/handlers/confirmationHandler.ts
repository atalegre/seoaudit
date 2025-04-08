
import { corsHeaders } from "../cors.ts";
import { resend, getVerifiedSenderEmail } from "../resendClient.ts";
import { ConfirmationEmailRequest, EmailRequest } from "../types.ts";

// Handle account confirmation emails
export async function handleConfirmationEmail(data: EmailRequest): Promise<Response> {
  const { email, name, confirmationUrl } = data as ConfirmationEmailRequest;

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
    
    // Modified sender email to use verified domain
    const fromEmail = getVerifiedSenderEmail();
    
    console.log(`Using from email: ${fromEmail} for confirmation email`);
    
    // Send confirmation email using Resend with more robust formatting
    const emailResponse = await resend.emails.send({
      from: `SEOAudit <${fromEmail}>`, // Using verified domain
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
  } catch (error: any) {
    console.error("Error sending confirmation email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: "Error during confirmation email sending"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
}
