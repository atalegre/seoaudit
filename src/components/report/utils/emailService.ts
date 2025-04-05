
import { supabase } from '@/integrations/supabase/client';

/**
 * Sends the report to a user's email
 * @param email Recipient email
 * @param name Recipient name
 * @param seoScore SEO score
 * @param aioScore AIO score
 * @param url Website URL
 * @returns Promise<boolean> Success status
 */
export async function sendReportByEmail(
  email: string,
  name: string,
  seoScore: number,
  aioScore: number,
  url: string
): Promise<boolean> {
  try {
    // Construir o URL do relatório com os parâmetros
    const reportUrl = `${window.location.origin}/dashboard/client?url=${encodeURIComponent(url)}`;
    
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'report',
        email,
        name,
        reportUrl,
        seoScore,
        aioScore,
        websiteUrl: url
      }
    });

    if (error) {
      console.error("Erro ao enviar email com relatório:", error);
      return false;
    } else {
      console.log("Email com relatório enviado:", data);
      return true;
    }
  } catch (error) {
    console.error("Exceção ao enviar email com relatório:", error);
    return false;
  }
}
