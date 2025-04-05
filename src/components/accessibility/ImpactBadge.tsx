
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AccessibilityViolation } from '@/utils/api/types';

interface ImpactBadgeProps {
  impact: AccessibilityViolation['impact'];
}

const ImpactBadge = ({ impact }: ImpactBadgeProps) => {
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

export default ImpactBadge;
