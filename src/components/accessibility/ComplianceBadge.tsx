
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ComplianceBadgeProps {
  label: string;
  compliant: boolean;
}

const ComplianceBadge = ({ label, compliant }: ComplianceBadgeProps) => {
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

export default ComplianceBadge;
