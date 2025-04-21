
import React from 'react';
import { Tag, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { safeGet } from '@/utils/dataChecks';

interface MetaTagsData {
  metaTags?: {
    title?: string;
    description?: string;
    titleLength?: number;
    descriptionLength?: number;
  };
}

interface MetaTagsSectionProps {
  data?: MetaTagsData;
  className?: string;
}

const MetaTagsSection = ({ data, className }: MetaTagsSectionProps) => {
  // Safely extract meta tag information with defaults
  const title = safeGet(data, 'metaTags.title', '');
  const description = safeGet(data, 'metaTags.description', '');
  const titleLength = safeGet(data, 'metaTags.titleLength', 0);
  const descriptionLength = safeGet(data, 'metaTags.descriptionLength', 0);
  
  // Calculate scores
  const hasTitle = title.length > 0;
  const hasDescription = description.length > 0;
  
  const titleScore = hasTitle ? 
    (titleLength >= 30 && titleLength <= 60 ? 100 : 
     titleLength > 0 && titleLength < 30 ? 50 : 
     titleLength > 60 && titleLength <= 80 ? 70 : 30) : 0;
     
  const descriptionScore = hasDescription ? 
    (descriptionLength >= 120 && descriptionLength <= 160 ? 100 : 
     descriptionLength > 0 && descriptionLength < 120 ? 60 : 
     descriptionLength > 160 && descriptionLength <= 200 ? 70 : 40) : 0;
     
  const overallScore = Math.round((titleScore + descriptionScore) / 2);
  
  return (
    <div className={className}>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Tag className="h-5 w-5 text-blue-500" />
        Meta Tags
      </h2>
      
      <div className="p-4 bg-white rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-medium">Avaliação Geral</h3>
          <span className={`text-sm font-semibold px-2 py-1 rounded ${
            overallScore >= 80 ? 'bg-green-100 text-green-800' : 
            overallScore >= 60 ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {overallScore}/100
          </span>
        </div>
        
        <Progress 
          value={overallScore} 
          className="h-2 mb-6" 
          indicatorClassName={
            overallScore >= 80 ? "bg-green-500" : 
            overallScore >= 60 ? "bg-yellow-500" : 
            "bg-red-500"
          }
        />
        
        <div className="space-y-6">
          {/* Title Tag */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {titleScore >= 80 ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : titleScore >= 50 ? (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <h4 className="text-sm font-medium">Meta Title</h4>
              </div>
              <span className="text-xs font-medium">{titleLength} caracteres</span>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-md text-sm mb-2 break-words">
              {hasTitle ? title : <em className="text-gray-400">Título não definido</em>}
            </div>
            
            <p className="text-xs text-gray-600">
              {!hasTitle ? "Meta title não encontrado. Este é um elemento crucial para SEO." : 
               titleLength < 30 ? "Meta title muito curto. O ideal é entre 30-60 caracteres." :
               titleLength > 60 ? "Meta title extenso. Google mostra apenas ~60 caracteres nos resultados." :
               "Meta title com tamanho ideal para SEO."}
            </p>
          </div>
          
          {/* Description Tag */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {descriptionScore >= 80 ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : descriptionScore >= 50 ? (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <h4 className="text-sm font-medium">Meta Description</h4>
              </div>
              <span className="text-xs font-medium">{descriptionLength} caracteres</span>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-md text-sm mb-2 break-words max-h-24 overflow-y-auto">
              {hasDescription ? description : <em className="text-gray-400">Descrição não definida</em>}
            </div>
            
            <p className="text-xs text-gray-600">
              {!hasDescription ? "Meta description não encontrada. Importante para CTR nos resultados de busca." : 
               descriptionLength < 120 ? "Meta description curta. O ideal é entre 120-160 caracteres." :
               descriptionLength > 160 ? "Meta description extensa. O Google mostra ~160 caracteres nos resultados." :
               "Meta description com tamanho ideal para SEO."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaTagsSection;
