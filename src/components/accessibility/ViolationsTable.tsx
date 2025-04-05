
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2 } from 'lucide-react';
import { AccessibilityViolation } from '@/utils/api/types';
import ImpactBadge from './ImpactBadge';

interface ViolationsTableProps {
  violations: AccessibilityViolation[];
}

const ViolationsTable = ({ violations }: ViolationsTableProps) => {
  if (violations.length === 0) {
    return (
      <div className="mt-6 text-center p-6 border border-dashed rounded-md">
        <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
        <h3 className="text-lg font-medium">Nenhum problema detectado</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Não foram encontrados problemas automáticos de acessibilidade, mas recomendamos testes manuais adicionais.
        </p>
      </div>
    );
  }

  return (
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
          {violations.map((violation, index) => (
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
  );
};

export default ViolationsTable;
