
import { Resend } from "npm:resend@2.0.0";

// Initialize Resend with the API key from environment variables
const resendApiKey = Deno.env.get("RESEND_API_KEY");
export const resend = new Resend(resendApiKey);

// Get a verified sender email address
export const getVerifiedSenderEmail = (): string => {
  return Deno.env.get("VERIFIED_EMAIL") || "no-reply@seoaudit.pt";
};
