
import { corsHeaders } from "../cors.ts";
import { resend } from "../resendClient.ts";
import { ContactRequest, EmailRequest } from "../types.ts";

// Handle contact form emails
export async function handleContactEmail(data: EmailRequest): Promise<Response> {
  const { name, email, message, subject = "Nova mensagem do website" } = data as ContactRequest;

  // Validate required fields
  if (!name || !email || !message) {
    throw new Error("Missing required fields: name, email and message are required");
  }

  console.log(`Attempting to send contact email to ${email}`);

  try {
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
  } catch (error: any) {
    console.error("Error sending contact email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: "Error during contact email sending"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
}
