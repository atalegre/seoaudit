
import React from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReportSheetProps {
  domain: string;
  report: string;
}

const ReportSheet: React.FC<ReportSheetProps> = ({ domain, report }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">Ver relatório completo</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Relatório de Presença LLM</SheetTitle>
          <SheetDescription>
            Análise completa da presença do domínio {domain} em modelos LLM.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <Textarea 
            value={report} 
            readOnly 
            rows={15} 
            className="text-sm font-mono w-full resize-none"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ReportSheet;
