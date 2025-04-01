
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ContentLayout from '@/components/content/ContentLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, Download, ChevronDown, ChevronUp, Globe, Bot, Rocket, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { checklistSections } from '@/data/checklist-data';

const SeoAioChecklistPage = () => {
  const [progressBySection, setProgressBySection] = useState<Record<string, number[]>>({});
  
  // Calculate overall progress
  const totalItems = checklistSections.reduce(
    (total, section) => total + section.items.length, 
    0
  );
  
  const completedItems = Object.values(progressBySection).reduce(
    (total, items) => total + items.length, 
    0
  );
  
  const progressPercentage = totalItems > 0 
    ? Math.round((completedItems / totalItems) * 100) 
    : 0;

  const toggleChecklistItem = (sectionId: string, itemId: number) => {
    setProgressBySection(prev => {
      const sectionProgress = prev[sectionId] || [];
      if (sectionProgress.includes(itemId)) {
        return {
          ...prev,
          [sectionId]: sectionProgress.filter(id => id !== itemId)
        };
      } else {
        return {
          ...prev,
          [sectionId]: [...sectionProgress, itemId]
        };
      }
    });
  };

  return (
    <ContentLayout className="bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/guias" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Voltar aos Guias
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col gap-4 mb-8">
          <h1 className="text-4xl font-bold">Checklist SEO+AIO</h1>
          <p className="text-lg text-muted-foreground">
            Um guia prático para otimizar o seu site para motores de busca e modelos de IA
          </p>
        </div>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-full md:w-2/3">
                <h2 className="text-xl font-semibold mb-2">O seu progresso</h2>
                <div className="w-full bg-secondary rounded-full h-4 mb-2">
                  <div 
                    className="bg-gradient-to-r from-seo to-aio h-4 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{completedItems} de {totalItems} itens completos</span>
                  <span>{progressPercentage}%</span>
                </div>
              </div>
              <div className="w-full md:w-1/3 flex justify-end">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" /> Exportar progresso
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-seo-light p-4 flex gap-3">
              <div className="rounded-full bg-white w-10 h-10 flex items-center justify-center flex-shrink-0">
                <Globe className="h-5 w-5 text-seo" />
              </div>
              <div>
                <h3 className="font-medium">SEO</h3>
                <p className="text-sm text-muted-foreground">Otimização para motores de busca</p>
              </div>
            </Card>
            
            <Card className="bg-aio-light p-4 flex gap-3">
              <div className="rounded-full bg-white w-10 h-10 flex items-center justify-center flex-shrink-0">
                <Bot className="h-5 w-5 text-aio" />
              </div>
              <div>
                <h3 className="font-medium">AIO</h3>
                <p className="text-sm text-muted-foreground">Otimização para inteligência artificial</p>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-r from-seo-light to-aio-light p-4 flex gap-3">
              <div className="rounded-full bg-white w-10 h-10 flex items-center justify-center flex-shrink-0">
                <Rocket className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Ambos</h3>
                <p className="text-sm text-muted-foreground">Aplica-se a SEO e AIO</p>
              </div>
            </Card>
          </div>

          {checklistSections.map((section, idx) => (
            <Accordion type="single" collapsible key={section.id} defaultValue={idx === 0 ? section.id : undefined}>
              <AccordionItem value={section.id} className="border rounded-lg">
                <AccordionTrigger className="px-6 py-4 hover:no-underline data-[state=open]:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-secondary rounded-full w-8 h-8 flex items-center justify-center">
                      {section.icon === 'rocket' && <Rocket className="h-4 w-4" />}
                      {section.icon === 'globe' && <Globe className="h-4 w-4" />}
                      {section.icon === 'bot' && <Bot className="h-4 w-4" />}
                    </div>
                    <div className="text-left">
                      <h2 className="text-lg font-medium">{section.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {(progressBySection[section.id] || []).length} de {section.items.length} completos
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4">
                  <div className="space-y-3">
                    {section.items.map((item, itemIdx) => (
                      <Card key={itemIdx} className="shadow-none">
                        <CardHeader className="p-4 pb-2">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`${section.id}-${itemIdx}`}
                              checked={(progressBySection[section.id] || []).includes(itemIdx)}
                              onCheckedChange={() => toggleChecklistItem(section.id, itemIdx)}
                            />
                            <label
                              htmlFor={`${section.id}-${itemIdx}`}
                              className="font-medium text-base cursor-pointer flex-1"
                            >
                              {item.title}
                            </label>
                            <div>
                              {item.relevance.includes('SEO') && (
                                <Badge className="bg-seo text-primary-foreground">SEO</Badge>
                              )}
                              {item.relevance.includes('AIO') && (
                                <Badge className="bg-aio text-primary-foreground ml-1">AIO</Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-muted-foreground text-sm">{item.description}</p>
                          {item.link && (
                            <div className="mt-2">
                              <Link 
                                to={item.link.url} 
                                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                              >
                                {item.link.text} <ArrowRight className="h-3 w-3" />
                              </Link>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
        
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center">
              <CheckCircle2 className="h-12 w-12 mb-4" />
              <h2 className="text-2xl font-bold mb-3">Precisa de ajuda com a sua estratégia SEO+AIO?</h2>
              <p className="mb-6">A nossa equipa de especialistas está pronta para ajudar com uma análise personalizada e uma estratégia sob medida.</p>
              <Button variant="secondary" asChild>
                <Link to="/contacto" className="px-8">Fale Conosco</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
};

export default SeoAioChecklistPage;
