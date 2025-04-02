
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ContentLayout from '@/components/content/ContentLayout';
import { Input } from '@/components/ui/input';
import { Search, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { glossaryTerms } from '@/data/glossary-data';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet';

const GlossaryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const letters = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  // Filtra termos baseado na pesquisa
  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter(term => 
      term.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.shortDefinition.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);
  
  // Agrupa termos por letra inicial
  const groupedTerms = useMemo(() => {
    return letters.reduce((acc, letter) => {
      if (letter === '#') {
        // Termos que começam com números ou caracteres especiais
        acc[letter] = filteredTerms.filter(term => /^[^a-zA-Z]/.test(term.title));
      } else {
        acc[letter] = filteredTerms.filter(term => 
          term.title.toLowerCase().startsWith(letter.toLowerCase())
        );
      }
      return acc;
    }, {} as Record<string, typeof glossaryTerms>);
  }, [filteredTerms, letters]);

  // Verifica se há resultados da pesquisa
  const hasResults = useMemo(() => {
    return filteredTerms.length > 0;
  }, [filteredTerms]);

  // Cria schema JSON-LD para o glossário
  const glossarySchemaData = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "name": "Glossário SEO+AI",
    "description": "Definições e explicações dos principais termos de SEO e IA",
    "hasDefinedTerm": glossaryTerms.map(term => ({
      "@type": "DefinedTerm",
      "name": term.title,
      "description": term.shortDefinition,
      "url": `https://seomaisdez.com/glossario/${term.slug}`
    }))
  };

  return (
    <>
      <Helmet>
        <title>Glossário de SEO e IA | Principais termos e definições</title>
        <meta name="description" content="Glossário completo com definições e explicações dos principais termos de SEO e Inteligência Artificial para otimização de conteúdo e visibilidade online." />
        <meta name="keywords" content="glossário seo, glossário ia, termos aio, dicionário seo, definições ia, otimização para inteligência artificial" />
        <script type="application/ld+json">
          {JSON.stringify(glossarySchemaData)}
        </script>
      </Helmet>
      
      <ContentLayout className="bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-4 mb-8">
            <h1 className="text-4xl font-bold">Glossário SEO+AI</h1>
            <p className="text-lg text-muted-foreground">
              Definições e explicações dos principais termos de SEO e Inteligência Artificial
            </p>
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Procurar por termo..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} 
              aria-label="Procurar termos no glossário"
            />
          </div>

          {!hasResults && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium">Nenhum termo encontrado</h3>
              <p className="text-muted-foreground">Tente outra pesquisa</p>
            </div>
          )}

          {letters.map(letter => {
            const terms = groupedTerms[letter] || [];
            if (terms.length === 0) return null;
            
            return (
              <div key={letter} id={`letter-${letter}`} className="mb-8">
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">{letter}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {terms.map(term => (
                    <Link to={`/glossario/${term.slug}`} key={term.slug}>
                      <Card className="h-full hover:border-primary transition-colors">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle>{term.title}</CardTitle>
                            <div className="flex flex-wrap gap-1">
                              {term.relevance.includes('SEO') && <Badge className="bg-seo text-primary-foreground">SEO</Badge>}
                              {term.relevance.includes('AIO') && <Badge className="bg-aio text-primary-foreground">AIO</Badge>}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>{term.shortDefinition}</CardDescription>
                          <div className="flex items-center text-primary text-sm mt-2">
                            Ler mais <ArrowRight className="h-3 w-3 ml-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
          
          <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold mb-4">Sobre este Glossário</h2>
            <p className="mb-4">
              Este glossário foi criado para ajudar profissionais de marketing, criadores de conteúdo e empresários a entender os termos técnicos relacionados ao SEO e à otimização para inteligência artificial (AIO).
            </p>
            <p className="mb-4">
              Com a evolução dos motores de busca e o crescente papel dos LLMs (Large Language Models) como intermediários de informação, compreender estes conceitos tornou-se essencial para garantir visibilidade online.
            </p>
            <p>
              Sugestão de termo faltando? Entre em <Link to="/contato" className="text-primary hover:underline">contato</Link> conosco.
            </p>
          </div>
        </div>
      </ContentLayout>
    </>
  );
};

export default GlossaryPage;
