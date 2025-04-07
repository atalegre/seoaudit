
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, CheckCircle, XCircle, AlertTriangle, FileText, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TechnicalAuditsPanelProps {
  mobileFriendly: boolean;
  security: {
    https: boolean;
    mixedContent: boolean;
  };
  headingsStructure: {
    hasH1: boolean;
    multipleH1: boolean;
    headingsOrder: boolean;
  };
  metaTags: {
    title: string;
    description: string;
    titleLength: number;
    descriptionLength: number;
  };
}

const TechnicalAuditsPanel: React.FC<TechnicalAuditsPanelProps> = ({
  mobileFriendly,
  security,
  headingsStructure,
  metaTags
}) => {
  // Function to determine status for title length
  const getTitleStatus = () => {
    if (metaTags.titleLength < 30) return "warning";
    if (metaTags.titleLength > 60) return "warning";
    return "success";
  };
  
  // Function to determine status for description length
  const getDescriptionStatus = () => {
    if (metaTags.descriptionLength < 70) return "warning";
    if (metaTags.descriptionLength > 160) return "warning";
    return "success";
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-primary" />
          Technical Audits
        </CardTitle>
        <CardDescription>
          Verificações técnicas importantes para SEO e funcionamento do site
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-5">
            {/* Mobile Friendly Section */}
            <div>
              <h3 className="font-medium flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-blue-600" />
                Mobile & Security
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mobile Friendly</span>
                  <div className={cn(
                    "flex items-center gap-1",
                    mobileFriendly ? "text-green-600" : "text-red-600"
                  )}>
                    {mobileFriendly ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Sim</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Não</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">HTTPS</span>
                  <div className={cn(
                    "flex items-center gap-1",
                    security.https ? "text-green-600" : "text-red-600"
                  )}>
                    {security.https ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Sim</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Não</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Conteúdo Misto</span>
                  <div className={cn(
                    "flex items-center gap-1",
                    !security.mixedContent ? "text-green-600" : "text-red-600"
                  )}>
                    {!security.mixedContent ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Não detectado</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Detectado</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Headings Structure */}
            <div>
              <h3 className="font-medium flex items-center gap-2 mb-3">
                <ListChecks className="h-4 w-4 text-violet-600" />
                Estrutura de Headings
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tag H1</span>
                  <div className={cn(
                    "flex items-center gap-1",
                    headingsStructure.hasH1 ? "text-green-600" : "text-red-600"
                  )}>
                    {headingsStructure.hasH1 ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Presente</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Ausente</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Múltiplos H1</span>
                  <div className={cn(
                    "flex items-center gap-1",
                    !headingsStructure.multipleH1 ? "text-green-600" : "text-amber-600"
                  )}>
                    {!headingsStructure.multipleH1 ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Não</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">Sim</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ordem de Headings</span>
                  <div className={cn(
                    "flex items-center gap-1",
                    headingsStructure.headingsOrder ? "text-green-600" : "text-amber-600"
                  )}>
                    {headingsStructure.headingsOrder ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Correta</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">Incorreta</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Meta Tags */}
          <div>
            <h3 className="font-medium flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-emerald-600" />
              Meta Tags
            </h3>
            
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Meta Title ({metaTags.titleLength} caracteres)</span>
                  <div className={cn(
                    "flex items-center gap-1",
                    getTitleStatus() === "success" ? "text-green-600" : "text-amber-600"
                  )}>
                    {getTitleStatus() === "success" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                  </div>
                </div>
                <div className="text-sm p-2 bg-muted rounded border">
                  {metaTags.title}
                </div>
                {getTitleStatus() === "warning" && (
                  <p className="text-xs text-amber-600 mt-1">
                    {metaTags.titleLength < 30 ? 
                      "O título é muito curto. Recomendado: 30-60 caracteres." : 
                      "O título é muito longo. Recomendado: até 60 caracteres."}
                  </p>
                )}
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Meta Description ({metaTags.descriptionLength} caracteres)</span>
                  <div className={cn(
                    "flex items-center gap-1",
                    getDescriptionStatus() === "success" ? "text-green-600" : "text-amber-600"
                  )}>
                    {getDescriptionStatus() === "success" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                  </div>
                </div>
                <div className="text-sm p-2 bg-muted rounded border text-muted-foreground">
                  {metaTags.description}
                </div>
                {getDescriptionStatus() === "warning" && (
                  <p className="text-xs text-amber-600 mt-1">
                    {metaTags.descriptionLength < 70 ? 
                      "A descrição é muito curta. Recomendado: 70-160 caracteres." : 
                      "A descrição é muito longa. Recomendado: até 160 caracteres."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalAuditsPanel;
