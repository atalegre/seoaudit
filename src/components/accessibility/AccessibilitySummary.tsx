
import React from 'react';
import { XCircle, AlertTriangle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { AccessibilityViolation } from '@/utils/api/types';
import ScoreCircle from '@/components/metrics/ScoreCircle';
import IssueCounter from './IssueCounter';

interface AccessibilitySummaryProps {
  score: number;
  passedTests: string[];
  violations: AccessibilityViolation[];
}

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

const AccessibilitySummary = ({ score, passedTests, violations }: AccessibilitySummaryProps) => {
  // Group violations by impact
  const criticalViolations = violations.filter(v => v.impact === 'critical');
  const seriousViolations = violations.filter(v => v.impact === 'serious');
  const moderateViolations = violations.filter(v => v.impact === 'moderate');
  const minorViolations = violations.filter(v => v.impact === 'minor');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="flex flex-col items-center justify-center">
        <ScoreCircle 
          score={score} 
          label="Pontuação de Acessibilidade" 
          colorClass={getScoreColorClass(score)}
          size="lg"
        />
        <p className="text-sm text-muted-foreground mt-2">
          {getScoreDescription(score)}
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
            {passedTests.map((test, index) => (
              <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {test}
              </Badge>
            ))}
            {passedTests.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum teste foi passado automaticamente.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilitySummary;
