
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLLMPresence } from "./useLLMPresence";
import ScoreCircle from "./ScoreCircle";
import ScoreAlert from "./ScoreAlert";
import ModelCard from "./ModelCard";
import RecommendationCard from "./RecommendationCard";
import ReportSheet from "./ReportSheet";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import BrandPresenceMonitor from "./BrandPresenceMonitor";
import { LLMPresenceAuditProps } from "./types";

const LLMPresenceAudit: React.FC<LLMPresenceAuditProps> = ({ url = "", autoStart = false }) => {
  const navigate = useNavigate();
  
  const {
    loading,
    error,
    presenceScore,
    report,
    domain,
    modelPresence,
    handleCheckPresence
  } = useLLMPresence({ url, autoStart });
  
  const goToContentWriter = () => {
    navigate('/suite/writer');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-aio" />
            Presença em Modelos de IA
          </CardTitle>
          <CardDescription>
            Análise de como a tua marca aparece em modelos de linguagem grandes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="warning" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {error}. Mostrando análise simulada.
              </AlertDescription>
            </Alert>
          )}
        
          {loading ? (
            <LoadingState />
          ) : presenceScore !== null ? (
            <>
              <ScoreCircle score={presenceScore} />
              <ScoreAlert score={presenceScore} />
              
              {/* Lista de modelos analisados */}
              <h3 className="text-sm font-medium mb-3">Presença por modelo</h3>
              <div className="space-y-4 mb-4">
                {modelPresence && modelPresence.map((model, index) => (
                  <ModelCard 
                    key={index} 
                    modelName={model.name} 
                    presencePercentage={model.score} 
                  />
                ))}
              </div>
              
              <ReportSheet domain={domain} report={report} />
            </>
          ) : (
            <ErrorState onRetry={handleCheckPresence} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LLMPresenceAudit;
