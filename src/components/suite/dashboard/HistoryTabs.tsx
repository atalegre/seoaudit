
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';

interface HistoryTabsProps {
  isUserLoggedIn: boolean;
  onLogin?: () => void;
}

const HistoryTabs = ({ isUserLoggedIn, onLogin }: HistoryTabsProps) => {
  if (!isUserLoggedIn) {
    return (
      <Card className="mt-8">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              Faça login para ver dados históricos e todas as recomendações
            </h3>
            <p className="text-muted-foreground mb-4">
              As informações detalhadas e o histórico de evolução estão disponíveis para utilizadores registados.
            </p>
            <Button onClick={onLogin}>
              Fazer Login
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-8">
      <Tabs defaultValue="seo">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="seo">Evolução SEO</TabsTrigger>
          <TabsTrigger value="aio">Evolução AIO</TabsTrigger>
          <TabsTrigger value="llm">Evolução LLM</TabsTrigger>
        </TabsList>
        <TabsContent value="seo" className="mt-6">
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Gráfico de evolução SEO</p>
          </div>
        </TabsContent>
        <TabsContent value="aio" className="mt-6">
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Gráfico de evolução AIO</p>
          </div>
        </TabsContent>
        <TabsContent value="llm" className="mt-6">
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Gráfico de evolução LLM</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HistoryTabs;
