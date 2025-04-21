
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ListChecks } from 'lucide-react';
import MobileSecuritySection from './audit-sections/MobileSecuritySection';
import HeadingsStructureSection from './audit-sections/HeadingsStructureSection';
import MetaTagsSection from './audit-sections/MetaTagsSection';

interface TechnicalAuditsPanelProps {
  data?: {
    mobileFriendly?: boolean;
    security?: {
      https?: boolean;
      mixedContent?: boolean;
    };
    headingsStructure?: {
      hasH1?: boolean;
      multipleH1?: boolean;
      headingsOrder?: boolean;
    };
    metaTags?: {
      title?: string;
      description?: string;
      titleLength?: number;
      descriptionLength?: number;
    };
  };
}

const TechnicalAuditsPanel: React.FC<TechnicalAuditsPanelProps> = ({ data = {} }) => {
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
            <MobileSecuritySection data={data} />
            
            <HeadingsStructureSection data={data} />
          </div>
          
          <MetaTagsSection data={data} />
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalAuditsPanel;
