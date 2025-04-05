
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, MessageSquare } from "lucide-react";
import { useLLMPresence } from "./useLLMPresence";
import ScoreCircle from "./ScoreCircle";
import ScoreAlert from "./ScoreAlert";
import MetricsGrid from "./MetricsGrid";
import ReportSheet from "./ReportSheet";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import { LLMPresenceAuditProps } from "./types";

const LLMPresenceAudit: React.FC<LLMPresenceAuditProps> = ({ url = "", autoStart = false }) => {
  const {
    loading,
    error,
    presenceScore,
    report,
    domain,
    handleCheckPresence
  } = useLLMPresence({ url, autoStart });

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-aio" />
            Presença em LLMs
          </CardTitle>
          <CardDescription>
            Análise de como a sua marca aparece em modelos de linguagem grandes
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
              <ScoreAlert />
              <MetricsGrid presenceScore={presenceScore} />
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
