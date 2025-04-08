
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

const KeywordResearch = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState<string[][]>([]);
  const [activeTab, setActiveTab] = useState('related');

  const handleSearch = async () => {
    if (!query) return;
    setIsLoading(true);

    // Simulação de chamada a API
    setTimeout(() => {
      setKeywords([
        ['restaurantes vegetarianos em lisboa', 'opções veganas perto de mim'],
        ['melhores restaurantes veganos 2025', 'dicas de alimentação saudável']
      ]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-2">Pesquisa de Palavras-chave</h1>
        <p className="text-muted-foreground text-sm mb-4">
          Descobre ideias de conteúdo e oportunidades de SEO com base na tua keyword.
        </p>
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex: restaurante vegetariano em Lisboa"
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Pesquisar'}
          </Button>
        </div>
      </div>

      {keywords.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="related">Relacionadas</TabsTrigger>
                <TabsTrigger value="longtail">Long tail</TabsTrigger>
              </TabsList>
              <TabsContent value="related">
                <ul className="list-disc list-inside space-y-1">
                  {keywords[0].map((kw, i) => <li key={i}>{kw}</li>)}
                </ul>
              </TabsContent>
              <TabsContent value="longtail">
                <ul className="list-disc list-inside space-y-1">
                  {keywords[1].map((kw, i) => <li key={i}>{kw}</li>)}
                </ul>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KeywordResearch;
