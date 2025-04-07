
import React from 'react';
import { ListChecks, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeadingsStructureSectionProps {
  headingsStructure: {
    hasH1: boolean;
    multipleH1: boolean;
    headingsOrder: boolean;
  };
}

const HeadingsStructureSection = ({ headingsStructure }: HeadingsStructureSectionProps) => {
  return (
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
  );
};

export default HeadingsStructureSection;
