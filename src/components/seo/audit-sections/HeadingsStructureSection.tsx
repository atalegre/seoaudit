
import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, List } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { safeGet } from '@/utils/dataChecks';

interface HeadingsData {
  headingsStructure?: {
    hasH1?: boolean;
    multipleH1?: boolean;
    headingsOrder?: boolean;
  };
}

interface HeadingsStructureSectionProps {
  data?: HeadingsData;
  className?: string;
}

const HeadingsStructureSection = ({ data, className }: HeadingsStructureSectionProps) => {
  // Default values if data is undefined
  const hasH1 = safeGet(data, 'headingsStructure.hasH1', false);
  const multipleH1 = safeGet(data, 'headingsStructure.multipleH1', false);
  const headingsOrder = safeGet(data, 'headingsStructure.headingsOrder', false);
  
  // Calculate overall score
  let score = 0;
  if (hasH1) score += 40;
  if (!multipleH1) score += 30;
  if (headingsOrder) score += 30;
  
  return (
    <div className={className}>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <List className="h-5 w-5 text-blue-500" />
        Estrutura de Cabeçalhos (H1-H6)
      </h2>
      
      <div className="p-4 bg-white rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-medium">Avaliação Geral</h3>
          <span className={`text-sm font-semibold px-2 py-1 rounded ${
            score >= 80 ? 'bg-green-100 text-green-800' : 
            score >= 60 ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {score}/100
          </span>
        </div>
        
        <Progress 
          value={score} 
          className="h-2 mb-6" 
          indicatorClassName={
            score >= 80 ? "bg-green-500" : 
            score >= 60 ? "bg-yellow-500" : 
            "bg-red-500"
          }
        />
        
        <div className="space-y-4">
          {/* H1 Tag */}
          <div className="flex items-start gap-3">
            {hasH1 ? (
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
            )}
            <div>
              <h4 className="text-sm font-medium">Tag H1 Principal</h4>
              <p className="text-sm text-gray-600">
                {hasH1 
                  ? "A página tem uma tag H1 definida corretamente." 
                  : "A página não tem tag H1, que é essencial para SEO."}
              </p>
            </div>
          </div>
          
          {/* Multiple H1 */}
          <div className="flex items-start gap-3">
            {!multipleH1 ? (
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
            )}
            <div>
              <h4 className="text-sm font-medium">H1 Único</h4>
              <p className="text-sm text-gray-600">
                {!multipleH1 
                  ? "A página tem apenas uma tag H1, conforme recomendado." 
                  : "A página tem múltiplas tags H1, o que pode confundir os motores de busca."}
              </p>
            </div>
          </div>
          
          {/* Headings Order */}
          <div className="flex items-start gap-3">
            {headingsOrder ? (
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
            )}
            <div>
              <h4 className="text-sm font-medium">Hierarquia de Cabeçalhos</h4>
              <p className="text-sm text-gray-600">
                {headingsOrder 
                  ? "A hierarquia de cabeçalhos (H1-H6) está em ordem lógica." 
                  : "A hierarquia de cabeçalhos não segue uma ordem lógica, o que prejudica a estrutura semântica."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadingsStructureSection;
