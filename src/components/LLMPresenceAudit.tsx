
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Search, CheckCircle, XCircle, AlertTriangle, MessageSquare } from "lucide-react";

interface LLMPresenceAuditProps {
  initialUrl?: string;
}

const LLMPresenceAudit: React.FC<LLMPresenceAuditProps> = ({ initialUrl = "" }) => {
  const [url, setUrl] = useState(initialUrl);
  const [domain, setDomain] = useState("");
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);

  const extractDomainFromUrl = (inputUrl: string): string => {
    try {
      const urlObj = new URL(inputUrl);
      return urlObj.hostname.replace('www.', '');
    } catch (e) {
      return "";
    }
  };

  const handleCheckPresence = async () => {
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
    setTimeout(() => {
      setReport(simulatedResponse);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="flex-1">
          <CardContent className="space-y-3 pt-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              Verificação de presença em modelos LLM
            </div>
            <Input 
              placeholder="https://www.exemplo.pt" 
              value={url} 
              onChange={(e) => {
                setUrl(e.target.value);
                if (!domain) {
                  const extractedDomain = extractDomainFromUrl(e.target.value);
                  if (extractedDomain) setDomain(extractedDomain);
                }
              }} 
            />
            <Input 
              placeholder="Nome do domínio ou marca (ex: Exemplo.pt)" 
              value={domain} 
              onChange={(e) => setDomain(e.target.value)} 
            />
            <Button 
              onClick={handleCheckPresence} 
              disabled={loading || (!url && !domain)} 
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  A verificar...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Executar auditoria LLM
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {report && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex justify-between mb-2">
              <h2 className="font-semibold">Relatório de Presença LLM</h2>
              <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</span>
            </div>
            
            <div className="bg-muted/50 p-3 rounded-md mb-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span className="font-medium">Visibilidade em LLM</span>
              </div>
              <p className="text-sm mb-2">Seu domínio tem visibilidade limitada em modelos de linguagem grandes.</p>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-amber-100 text-amber-800 rounded-full px-2 py-0.5">
                  Necessita melhorias
                </span>
              </div>
            </div>
            
            <Textarea 
              value={report} 
              readOnly 
              rows={10} 
              className="text-sm font-mono w-full resize-none"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LLMPresenceAudit;
