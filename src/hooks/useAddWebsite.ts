
import { useState } from 'react';
import { toast } from 'sonner';
import { getFullAnalysis } from '@/utils/api';
import { saveClientsToDatabase } from '@/utils/api/clientService';
import { WebsiteFormValues } from '@/components/dashboard/forms/websiteFormSchema';

interface UseAddWebsiteProps {
  onSuccess?: () => void;
  userId?: string;
}

export const useAddWebsite = ({ onSuccess, userId }: UseAddWebsiteProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addWebsite = async (values: WebsiteFormValues) => {
    setIsSubmitting(true);
    try {
      // Normalize URL
      let url = values.website;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      toast.info("A iniciar análise...", {
        description: "Este processo pode demorar alguns segundos."
      });
      
      // Perform the analysis
      const analysis = await getFullAnalysis(url);
      
      // Create a new client object with the analysis results
      const newClient = {
        id: Date.now(), // Simple ID generation for now
        name: values.name,
        website: url,
        contactName: '',
        contactEmail: '',
        notes: '',
        status: analysis.overallStatus || 'pending',
        account: userId || 'Admin',
        seoScore: analysis.seo.score || 0,
        aioScore: analysis.aio.score || 0,
        accessibilityScore: analysis.accessibility?.score || 0,
        lastAnalysis: new Date().toISOString(),
        lastReport: ''
      };
      
      // Save the new client to the database
      await saveClientsToDatabase([newClient]);
      
      toast.success("Website adicionado com sucesso", {
        description: "A análise foi concluída e o website foi adicionado."
      });
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }

      return true;
    } catch (error) {
      console.error("Error adding website:", error);
      toast.error("Erro ao adicionar website", {
        description: "Ocorreu um erro ao analisar o website. Por favor tente novamente."
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    addWebsite,
    isSubmitting
  };
};
