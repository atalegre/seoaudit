
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Check, X, AlertTriangle, Shield, Smartphone, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TechnicalAuditsPanelProps {
  mobileFriendly: boolean;
  security: boolean;
  headingsStructure?: number;
  metaTags?: number;
}

const TechnicalAuditsPanel: React.FC<TechnicalAuditsPanelProps> = ({
  mobileFriendly,
  security,
  headingsStructure = 0,
  metaTags = 0
}) => {
  // Avaliar status das métricas
  const headingsStatus = headingsStructure >= 80 ? "good" : headingsStructure >= 50 ? "needs-improvement" : "poor";
  const metaTagsStatus = metaTags >= 80 ? "good" : metaTags >= 50 ? "needs-improvement" : "poor";
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Auditorias Técnicas
        </CardTitle>
        <CardDescription>
          Verificações técnicas importantes para SEO e experiência do usuário
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mobile Friendly Check */}
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="bg-blue-50 p-2 rounded-full">
              <Smartphone className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="text-sm font-medium">Mobile Friendly</h3>
                <div className="flex items-center gap-1">
                  {mobileFriendly ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <X className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {mobileFriendly 
                  ? "O site é adaptado para dispositivos móveis" 
                  : "O site não é adaptado para dispositivos móveis"}
              </p>
            </div>
          </div>
          
          {/* HTTPS Security */}
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="bg-blue-50 p-2 rounded-full">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="text-sm font-medium">Segurança HTTPS</h3>
                <div className="flex items-center gap-1">
                  {security ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <X className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {security 
                  ? "Conexão segura estabelecida" 
                  : "Site sem proteção HTTPS"}
              </p>
            </div>
          </div>
          
          {/* Headings Structure */}
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="bg-blue-50 p-2 rounded-full">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="text-sm font-medium">Estrutura de Headings</h3>
                <div className="flex items-center gap-1">
                  {headingsStatus === "good" ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : headingsStatus === "needs-improvement" ? (
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  ) : (
                    <X className="h-5 w-5 text-red-600" />
                  )}
                  <span className={cn(
                    "text-sm font-medium",
                    headingsStatus === "good" ? "text-green-600" : 
                    headingsStatus === "needs-improvement" ? "text-amber-600" : 
                    "text-red-600"
                  )}>
                    {headingsStructure}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {headingsStatus === "good" 
                  ? "Estrutura de headings bem organizada" 
                  : headingsStatus === "needs-improvement"
                  ? "Estrutura precisa de melhorias"
                  : "Estrutura de headings inadequada"}
              </p>
            </div>
          </div>
          
          {/* Meta Tags */}
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="bg-blue-50 p-2 rounded-full">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="text-sm font-medium">Meta Tags</h3>
                <div className="flex items-center gap-1">
                  {metaTagsStatus === "good" ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : metaTagsStatus === "needs-improvement" ? (
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  ) : (
                    <X className="h-5 w-5 text-red-600" />
                  )}
                  <span className={cn(
                    "text-sm font-medium",
                    metaTagsStatus === "good" ? "text-green-600" : 
                    metaTagsStatus === "needs-improvement" ? "text-amber-600" : 
                    "text-red-600"
                  )}>
                    {metaTags}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {metaTagsStatus === "good" 
                  ? "Meta tags bem implementadas" 
                  : metaTagsStatus === "needs-improvement"
                  ? "Meta tags precisam de melhorias"
                  : "Meta tags inadequadas ou ausentes"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalAuditsPanel;
