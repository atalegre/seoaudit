
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LLMReport } from "./types";
import { highlightDomain } from "./jsxUtils";

interface ReportSheetProps {
  domain: string;
  report: LLMReport | null;
}

const ReportSheet: React.FC<ReportSheetProps> = ({ domain, report }) => {
  if (!report) return null;
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full mt-4">
          <FileText className="h-4 w-4 mr-2" />
          Ver relatório completo
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[90%] sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Relatório de Presença nos Modelos de IA</SheetTitle>
          <SheetDescription>
            Análise detalhada de como "{domain}" aparece em modelos de linguagem grandes
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Metrics overview */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted/50 p-3 rounded-md text-center">
              <div className="text-2xl font-bold">{report.totalMentions}</div>
              <div className="text-xs text-muted-foreground">Menções totais</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-md text-center">
              <div className="text-2xl font-bold">{report.score}%</div>
              <div className="text-xs text-muted-foreground">Visibilidade</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-md text-center">
              <div className="text-2xl font-bold">{report.accuracyScore}%</div>
              <div className="text-xs text-muted-foreground">Precisão</div>
            </div>
          </div>
          
          {/* Mentions table */}
          <div>
            <h3 className="text-sm font-medium mb-2">Menções em modelos de IA</h3>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Pergunta</TableHead>
                    <TableHead>Menção</TableHead>
                    <TableHead>Correção</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.mentions.map((mention, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{mention.model}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{mention.query}</TableCell>
                      <TableCell>
                        {mention.hasMention ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <span className="text-red-500">✕</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {mention.needsCorrection ? (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          {/* Detailed responses */}
          <div>
            <h3 className="text-sm font-medium mb-2">Respostas detalhadas</h3>
            <div className="space-y-4">
              {report.mentions.map((mention, idx) => (
                <div key={idx} className="p-3 border rounded-md bg-muted/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{mention.model}</span>
                    <span className="text-xs text-muted-foreground">{mention.date}</span>
                  </div>
                  <p className="text-xs mb-1 text-muted-foreground">Pergunta:</p>
                  <p className="text-sm mb-2">{mention.query}</p>
                  <p className="text-xs mb-1 text-muted-foreground">Resposta:</p>
                  <p className="text-sm">
                    {highlightDomain(mention.response, domain)}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recommendations */}
          <div>
            <h3 className="text-sm font-medium mb-2">Principais recomendações</h3>
            <ul className="space-y-2">
              {report.recommendations.map((rec, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Competitors */}
          <div>
            <h3 className="text-sm font-medium mb-2">Concorrentes mencionados</h3>
            <div className="flex flex-wrap gap-2">
              {report.competitors.map((competitor, idx) => (
                <span key={idx} className="text-xs bg-muted px-2 py-1 rounded-full">
                  {competitor}
                </span>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ReportSheet;
