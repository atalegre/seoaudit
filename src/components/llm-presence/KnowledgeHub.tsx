
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Lock, XCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { LLMReport } from './types';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface KnowledgeHubProps {
  domain: string;
  report: LLMReport | null;
  isLoggedIn: boolean;
}

const KnowledgeHub: React.FC<KnowledgeHubProps> = ({ domain, report, isLoggedIn }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  if (!isLoggedIn) {
    return (
      <div className="py-12 px-4">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="rounded-full bg-amber-100 p-3">
            <Lock className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="text-lg font-medium">Funcionalidade Premium</h3>
          <p className="text-muted-foreground max-w-md">
            O Hub de Conhecimento identifica discrepâncias entre o conteúdo oficial da sua marca e 
            as informações apresentadas pelas plataformas de IA.
            Faça login para aceder a esta funcionalidade.
          </p>
          <Button>Entrar na Conta</Button>
        </div>
      </div>
    );
  }
  
  // In a real implementation, this data would come from the API
  const knowledgeIssues = report?.outdatedInfo || [
    "A informação sobre localização da empresa está desatualizada",
    "O nome do CEO mencionado não está correto",
    "Os produtos mais recentes não são mencionados em algumas respostas",
    "Há inconsistências na descrição dos serviços oferecidos"
  ];
  
  const handleCorrectIssue = (issue: string) => {
    toast.success("Correção submetida", {
      description: "A informação será atualizada e monitorizada nas próximas 24-48 horas.",
    });
  };
  
  if (knowledgeIssues.length === 0) {
    return (
      <div className="py-6">
        <Alert variant="default" className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Não foram encontradas discrepâncias de conhecimento significativas para {domain}.
            As informações sobre a sua marca estão consistentes nas plataformas de IA.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 py-2">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Hub de Conhecimento</h3>
        <p className="text-sm text-muted-foreground">
          Identifica e corrige discrepâncias entre o conteúdo oficial e as informações apresentadas em IAs
        </p>
      </div>
      
      <Alert variant="default" className="bg-blue-50 border-blue-200">
        <AlertTriangle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Encontrámos {knowledgeIssues.length} discrepâncias de conhecimento que podem afetar como a sua marca é apresentada em plataformas de IA.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <FileText className="h-4 w-4 mr-2 text-amber-500" />
            Discrepâncias Identificadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {knowledgeIssues.map((issue, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-sm font-normal">
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 mr-2 text-red-500 shrink-0" />
                    <span>{issue}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    <div className="rounded-md bg-muted p-3 text-sm">
                      <p className="font-medium mb-1">Informação incorreta nos modelos de IA:</p>
                      <p className="text-muted-foreground">{issue}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Recomendação:</p>
                      <p className="text-sm text-muted-foreground">
                        Atualize a informação no seu website e forneça a versão correta abaixo para incluir nos nossos relatórios para as plataformas de IA.
                      </p>
                      <div className="flex justify-end space-x-2 mt-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCorrectIssue(issue)}
                        >
                          Corrigir Informação
                        </Button>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Como melhorar a presença da sua marca</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Recomendamos as seguintes ações para melhorar como a sua marca é apresentada em plataformas de IA:
          </p>
          <ul className="text-sm space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
              <span>Atualizar a página "Sobre Nós" com informações recentes e precisas</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
              <span>Adicionar uma secção FAQ com informações comumente solicitadas</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
              <span>Garantir que o conteúdo do website está estruturado com dados Schema.org</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
              <span>Verificar presença na Wikipedia e outras fontes de referência utilizadas pelos modelos de IA</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeHub;
