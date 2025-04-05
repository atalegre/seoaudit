
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AccessibilityAnalysisResult } from '@/utils/api/types';
import ComplianceBadge from './accessibility/ComplianceBadge';
import AccessibilitySummary from './accessibility/AccessibilitySummary';
import ViolationsTable from './accessibility/ViolationsTable';
import ManualChecks from './accessibility/ManualChecks';

interface AccessibilityPanelProps {
  data: AccessibilityAnalysisResult;
  className?: string;
}

const AccessibilityPanel = ({ data, className = '' }: AccessibilityPanelProps) => {
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
        <AccessibilitySummary 
          score={data.score} 
          passedTests={data.passedTests} 
          violations={data.violations} 
        />
        
        <ViolationsTable violations={data.violations} />
        
        <ManualChecks checks={data.manualChecksNeeded} />
      </CardContent>
    </Card>
  );
};

export default AccessibilityPanel;
