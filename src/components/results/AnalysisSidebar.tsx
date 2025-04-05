
import React from 'react';
import { FileText } from 'lucide-react';
import ReportForm from '@/components/ReportForm';
import { useIsMobile } from '@/hooks/use-mobile';

interface AnalysisSidebarProps {
  url: string;
  seoScore: number;
  aioScore: number;
}

const AnalysisSidebar: React.FC<AnalysisSidebarProps> = ({ 
  url, 
  seoScore, 
  aioScore 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="bg-white rounded-lg border shadow-sm p-6 sticky top-4">
      <h3 className="text-lg font-semibold mb-4">Já sabe o que pode melhorar?</h3>
      <p className="text-gray-600 mb-6">A nossa equipa de especialistas pode ajudar a implementar estas melhorias e elevar a presença digital do seu negócio.</p>
      
      <ReportForm 
        url={url} 
        seoScore={seoScore}
        aioScore={aioScore}
        compact={isMobile}
      />
      
      <div className="mt-6 pt-4 border-t">
        <button 
          className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800"
          onClick={() => {
            alert("Funcionalidade de exportar PDF em desenvolvimento");
          }}
        >
          <FileText className="h-4 w-4" />
          <span>Exportar PDF do relatório</span>
        </button>
      </div>
    </div>
  );
};

export default AnalysisSidebar;
