
import { useState } from 'react';
import { Client } from '@/utils/api/types';
import { getClientAnalysisHistory } from '@/utils/api';
import { toast } from 'sonner';

export interface AnalysisData {
  seoScore: number;
  aioScore: number;
  scoreDiff: { seo: number; aio: number };
  lastUpdate: string;
  implementedRecommendations: number;
  totalRecommendations: number;
  clientReports: any[];
}

export function useClientAnalysis() {
  const [seoScore, setSeoScore] = useState(0);
  const [aioScore, setAioScore] = useState(0);
  const [scoreDiff, setScoreDiff] = useState({ seo: 0, aio: 0 });
  const [lastUpdate, setLastUpdate] = useState('');
  const [implementedRecommendations, setImplementedRecommendations] = useState(0);
  const [totalRecommendations, setTotalRecommendations] = useState(0);
  const [clientReports, setClientReports] = useState<any[]>([]);

  const fetchAnalysisData = async (client: Client | null): Promise<void> => {
    if (!client) return;

    try {
      // Use data from the client object if no history is available
      setSeoScore(client.seoScore || 0);
      setAioScore(client.aioScore || 0);
      
      // Set last update date from the client if available
      if (client.lastAnalysis) {
        const lastAnalysisDate = new Date(client.lastAnalysis);
        setLastUpdate(lastAnalysisDate.toLocaleDateString());
      }
      
      // Fetch analysis history for this client
      try {
        const history = await getClientAnalysisHistory(client.id);
        console.log("Analysis history:", history);
        
        if (history && history.length > 0) {
          // Sort from newest to oldest
          const sortedHistory = [...history].sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          
          // Get the most recent report
          const latestReport = sortedHistory[0];
          console.log("Latest report:", latestReport);
          
          // Update scores
          setSeoScore(latestReport.seo?.score || client.seoScore || 0);
          setAioScore(latestReport.aio?.score || client.aioScore || 0);
          
          // Update last update
          setLastUpdate(new Date(latestReport.timestamp).toLocaleDateString());
          
          // Calculate difference if there are at least 2 reports
          if (sortedHistory.length > 1) {
            const previousReport = sortedHistory[1];
            setScoreDiff({
              seo: (latestReport.seo?.score || 0) - (previousReport.seo?.score || 0),
              aio: (latestReport.aio?.score || 0) - (previousReport.aio?.score || 0)
            });
          }
          
          // Count recommendations
          if (latestReport.recommendations) {
            setTotalRecommendations(latestReport.recommendations.length);
            const implemented = latestReport.recommendations.filter((r: any) => r.status === 'done').length;
            setImplementedRecommendations(implemented);
          }
          
          // Format reports for display
          const formattedReports = sortedHistory.slice(0, 4).map((report, index) => ({
            id: index + 1,
            name: `Relatório ${(report.seo?.score || 0) > (report.aio?.score || 0) ? 'SEO' : 'AIO'} ${new Date(report.timestamp).toLocaleDateString()}`,
            date: new Date(report.timestamp).toLocaleDateString(),
            status: 'completed',
            type: (report.seo?.score || 0) > (report.aio?.score || 0) ? 'SEO' : 'AIO'
          }));
          
          setClientReports(formattedReports);
        } else {
          console.log("No history for this client");
          
          // Create a basic report entry from client data
          setClientReports([{
            id: 1,
            name: `Análise inicial ${new Date().toLocaleDateString()}`,
            date: new Date().toLocaleDateString(),
            status: 'completed',
            type: client.seoScore > client.aioScore ? 'SEO' : 'AIO'
          }]);
        }
        
        // Show success message when data is loaded
        toast.success("Dashboard atualizado", {
          description: "Os dados do site foram carregados com sucesso."
        });
      } catch (error) {
        console.error("Error fetching analysis history:", error);
        // Create a basic report entry from client data
        setClientReports([{
          id: 1,
          name: `Análise inicial ${new Date().toLocaleDateString()}`,
          date: new Date().toLocaleDateString(),
          status: 'completed',
          type: client.seoScore > client.aioScore ? 'SEO' : 'AIO'
        }]);
      }
    } catch (error) {
      console.error('Error processing analysis data:', error);
    }
  };

  return {
    seoScore,
    aioScore,
    scoreDiff,
    lastUpdate,
    implementedRecommendations,
    totalRecommendations,
    clientReports,
    fetchAnalysisData
  };
}
