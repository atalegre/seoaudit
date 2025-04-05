
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';
import { AccessibilityAnalysisResult, AccessibilityViolation } from '@/utils/api/types';
import ScoreCircle from '@/components/metrics/ScoreCircle';

interface AccessibilityPanelProps {
  data: AccessibilityAnalysisResult;
  className?: string;
}

const AccessibilityPanel = ({ data, className = '' }: AccessibilityPanelProps) => {
  // Group violations by impact
  const criticalViolations = data.violations.filter(v => v.impact === 'critical');
  const seriousViolations = data.violations.filter(v => v.impact === 'serious');
  const moderateViolations = data.violations.filter(v => v.impact === 'moderate');
  const minorViolations = data.violations.filter(v => v.impact === 'minor');
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Acessibilidade</span>
          <div className="flex gap-2">
            <ComplianceBadge label="WCAG 2.1 AA" compliant={data.wcagCompliant} />
            <ComplianceBadge label="EAA" compliant={data.eaaCompliant} />
          </div>
        </CardTitle>
        <CardDescription>
          Auditoria de acessibilidade com base nos padrões WCAG 2.1 AA e European Accessibility Act
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="flex flex-col items-center justify-center">
            <ScoreCircle 
              score={data.score} 
              label="Pontuação de Acessibilidade" 
              colorClass={getScoreColorClass(data.score)}
              size="lg"
            />
            <p className="text-sm text-muted-foreground mt-2">
              {getScoreDescription(data.score)}
            </p>
          </div>
          
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              <IssueCounter 
                count={criticalViolations.length} 
                label="Críticos" 
                icon={<XCircle className="h-5 w-5 text-red-500" />} 
              />
              <IssueCounter 
                count={seriousViolations.length} 
                label="Sérios" 
                icon={<AlertTriangle className="h-5 w-5 text-amber-500" />} 
              />
              <IssueCounter 
                count={moderateViolations.length} 
                label="Moderados" 
                icon={<Info className="h-5 w-5 text-blue-500" />} 
              />
              <IssueCounter 
                count={minorViolations.length} 
                label="Pequenos" 
                icon={<Info className="h-5 w-5 text-gray-500" />} 
              />
            </div>
            
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium">Testes Automatizados Passados:</h4>
              <div className="flex flex-wrap gap-2">
                {data.passedTests.map((test, index) => (
                  <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {test}
                  </Badge>
                ))}
                {data.passedTests.length === 0 && (
                  <p className="text-sm text-muted-foreground">Nenhum teste foi passado automaticamente.</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {data.violations.length > 0 ? (
          <div className="mt-4 rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Problema</TableHead>
                  <TableHead>Impacto</TableHead>
                  <TableHead className="text-right">Ocorrências</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.violations.map((violation, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{violation.description}</TableCell>
                    <TableCell>
                      <ImpactBadge impact={violation.impact} />
                    </TableCell>
                    <TableCell className="text-right">{violation.nodes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="mt-6 text-center p-6 border border-dashed rounded-md">
            <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h3 className="text-lg font-medium">Nenhum problema detectado</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Não foram encontrados problemas automáticos de acessibilidade, mas recomendamos testes manuais adicionais.
            </p>
          </div>
        )}
        
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Verificações Manuais Recomendadas:</h4>
          <ul className="space-y-1 text-sm">
            {data.manualChecksNeeded.map((check, index) => (
              <li key={index} className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                <span>{check}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper components
const ComplianceBadge = ({ label, compliant }: { label: string, compliant: boolean }) => {
  return compliant ? (
    <Badge className="bg-green-100 hover:bg-green-200 text-green-800 border-green-300">
      <CheckCircle2 className="h-3 w-3 mr-1" /> {label}
    </Badge>
  ) : (
    <Badge variant="outline" className="border-red-300 text-red-700">
      <XCircle className="h-3 w-3 mr-1" /> {label}
    </Badge>
  );
};

const ImpactBadge = ({ impact }: { impact: AccessibilityViolation['impact'] }) => {
  switch (impact) {
    case 'critical':
      return <Badge className="bg-red-100 text-red-800">Crítico</Badge>;
    case 'serious':
      return <Badge className="bg-amber-100 text-amber-800">Sério</Badge>;
    case 'moderate':
      return <Badge className="bg-blue-100 text-blue-800">Moderado</Badge>;
    case 'minor':
      return <Badge variant="outline">Pequeno</Badge>;
    default:
      return null;
  }
};

const IssueCounter = ({ count, label, icon }: { count: number, label: string, icon: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center p-2 border rounded-md">
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-lg font-bold">{count}</span>
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
};

// Helper to get score color class
const getScoreColorClass = (score: number): string => {
  if (score >= 90) return "text-green-500";
  if (score >= 80) return "text-green-500";
  if (score >= 70) return "text-yellow-500";
  if (score >= 60) return "text-amber-500";
  if (score >= 50) return "text-orange-500";
  return "text-red-500";
};

// Helper to get score description
const getScoreDescription = (score: number): string => {
  if (score >= 90) return "Excelente";
  if (score >= 80) return "Muito bom";
  if (score >= 70) return "Bom";
  if (score >= 60) return "Regular";
  if (score >= 50) return "Precisa de atenção";
  return "Problemático";
};

export default AccessibilityPanel;
