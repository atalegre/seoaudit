
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Loader2, AlertTriangle, MessageSquare, PenLine, CheckCircle, XCircle } from "lucide-react";

interface LLMPresenceAuditProps {
  url?: string;
  autoStart?: boolean;
}

const LLMPresenceAudit: React.FC<LLMPresenceAuditProps> = ({ url = "", autoStart = false }) => {
  const [domain, setDomain] = useState("");
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [presenceScore, setPresenceScore] = useState<number | null>(null);

  const extractDomainFromUrl = (urlString: string): string => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.hostname.replace('www.', '');
    } catch (e) {
      return "";
    }
  };

  useEffect(() => {
    if (url && autoStart) {
      const extractedDomain = extractDomainFromUrl(url);
      if (extractedDomain) {
        setDomain(extractedDomain);
        handleCheckPresence();
      }
    }
  }, [url, autoStart]);

  const handleCheckPresence = async () => {
    if (!domain && !url) return;
    
    setLoading(true);
    
    const domainToUse = domain || extractDomainFromUrl(url);
    
    // Simulação de chamada à API do ChatGPT
    const simulatedResponse = `
Resultado da auditoria LLM para o domínio: ${domainToUse}

❌ A sua marca ainda não é mencionada diretamente em respostas de IA.

Recomendações:
- Criar artigos que respondam a perguntas diretas sobre ${domainToUse}
- Incluir definições claras sobre serviços e objetivos
- Aumentar a autoridade com backlinks
- Garantir estrutura clara (headings, listas, FAQ)

✔️ O conteúdo atual já aborda temas relevantes para AIO
`;
    
    // Simulate a score based on the content
    const randomScore = Math.floor(Math.random() * 40) + 30; // Random score between 30-70
    
    setTimeout(() => {
      setReport(simulatedResponse);
      setPresenceScore(randomScore);
      setLoading(false);
    }, 1500);
  };

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
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-aio" />
                <p className="text-muted-foreground">Analisando presença em LLMs...</p>
              </div>
            </div>
          ) : presenceScore !== null ? (
            <>
              <div className="mb-6 flex justify-center">
                <div className="w-32 h-32 relative flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke="#e2e8f0"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke={presenceScore > 70 ? '#8B5CF6' : presenceScore > 40 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="8"
                      strokeDasharray={`${presenceScore * 2.83} ${283 - presenceScore * 2.83}`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <span className="absolute text-3xl font-bold">{presenceScore}%</span>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-md mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Visibilidade limitada em LLMs</h4>
                    <p className="text-sm text-muted-foreground">
                      Seu domínio tem visibilidade limitada em modelos de linguagem grandes. 
                      Veja o relatório completo para recomendações.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-full bg-red-100">
                        <XCircle className="h-5 w-5 text-red-600" />
                      </div>
                      <h3 className="font-medium">Menção direta</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Sua marca não é mencionada diretamente em respostas de IA.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-full bg-amber-100">
                        <PenLine className="h-5 w-5 text-amber-600" />
                      </div>
                      <h3 className="font-medium">Estrutura</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Conteúdo precisa de melhor estrutura para contexto AIO.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-full bg-green-100">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <h3 className="font-medium">Relevância</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      O conteúdo aborda temas relevantes para AIO.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">Ver relatório completo</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Relatório de Presença LLM</SheetTitle>
                    <SheetDescription>
                      Análise completa da presença do domínio {domain || extractDomainFromUrl(url)} em modelos LLM.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <Textarea 
                      value={report} 
                      readOnly 
                      rows={15} 
                      className="text-sm font-mono w-full resize-none"
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <AlertTriangle className="h-10 w-10 text-amber-500" />
              <p className="text-center text-muted-foreground">Não foi possível analisar a presença em LLMs para este domínio.</p>
              <Button onClick={handleCheckPresence}>
                Tentar novamente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LLMPresenceAudit;
