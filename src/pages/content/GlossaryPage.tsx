
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ContentLayout from '@/components/content/ContentLayout';
import { Input } from '@/components/ui/input';
import { Search, ArrowRight, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { glossaryTerms } from '@/data/glossary-data';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const GlossaryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLetterHighlight, setActiveLetterHighlight] = useState('');
  const letters = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
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

  // Identifica quais letras têm termos (para o índice alfabético)
  const hasTermsForLetter = useMemo(() => {
    return letters.reduce((acc, letter) => {
      acc[letter] = (groupedTerms[letter]?.length || 0) > 0;
      return acc;
    }, {} as Record<string, boolean>);
  }, [groupedTerms, letters]);

  // Calcula os 5 termos mais populares usando a quantidade de referências como métrica
  const popularTerms = useMemo(() => {
    const termCountMap = new Map<string, number>();
    
    // Count how many times each term is referenced by other terms
    glossaryTerms.forEach(term => {
      if (term.related && term.related.length) {
        term.related.forEach(relatedSlug => {
          const count = termCountMap.get(relatedSlug) || 0;
          termCountMap.set(relatedSlug, count + 1);
        });
      }
    });
    
    // Sort by reference count and take top 5
    return [...termCountMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([slug]) => glossaryTerms.find(term => term.slug === slug))
      .filter(Boolean);
  }, []);

  // Observer for scroll position to highlight active letter
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id.startsWith('letter-')) {
              const letter = id.replace('letter-', '');
              setActiveLetterHighlight(letter);
            }
          }
        });
      },
      { threshold: 0.2, rootMargin: "-100px 0px -80% 0px" }
    );
    
    // Observe all letter sections
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    
    return () => {
      observer.disconnect();
    };
  }, [hasResults, groupedTerms]);

  // Scroll to letter section
  const scrollToLetter = (letter: string) => {
    if (sectionRefs.current[letter]) {
      sectionRefs.current[letter]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Cria schema JSON-LD para o glossário
  const glossarySchemaData = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "name": "Glossário SEO+AI",
    "description": "Definições e explicações dos principais termos de SEO e IA",
    "numberOfItems": glossaryTerms.length,
    "keywords": "SEO, Inteligência Artificial, AIO, Marketing Digital, Glossário",
    "hasDefinedTerm": glossaryTerms.map(term => ({
      "@type": "DefinedTerm",
      "name": term.title,
      "description": term.shortDefinition,
      "url": `https://seomaisdez.com/glossario/${term.slug}`
    }))
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Início",
        "item": "https://seomaisdez.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Glossário SEO+AI",
        "item": "https://seomaisdez.com/glossario"
      }
    ]
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
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      
      <ContentLayout className="bg-secondary/30">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 max-w-6xl mx-auto">
          {/* Alphabet sidebar */}
          <div className="hidden lg:block sticky top-24 self-start h-[calc(100vh-120px)]">
            <div className="text-lg font-medium mb-2">Navegar por letra</div>
            <ScrollArea className="h-[calc(100vh-170px)]">
              <div className="flex flex-col gap-1 pr-4">
                {letters.map(letter => (
                  <Button 
                    key={letter} 
                    variant={hasTermsForLetter[letter] ? (activeLetterHighlight === letter ? "default" : "outline") : "ghost"} 
                    size="sm"
                    disabled={!hasTermsForLetter[letter]}
                    className={`justify-start ${!hasTermsForLetter[letter] && 'opacity-30'} ${activeLetterHighlight === letter ? 'bg-primary text-primary-foreground' : ''}`}
                    onClick={() => scrollToLetter(letter)}
                  >
                    {letter === '#' ? <Hash className="h-4 w-4 mr-1" /> : letter}
                    {hasTermsForLetter[letter] && 
                      <span className="ml-auto text-xs bg-muted rounded px-1.5 py-0.5">
                        {groupedTerms[letter].length}
                      </span>
                    }
                  </Button>
                ))}
              </div>
            </ScrollArea>

            {popularTerms.length > 0 && (
              <>
                <Separator className="my-4" />
                <div className="text-lg font-medium mb-2">Termos populares</div>
                <div className="flex flex-col gap-1">
                  {popularTerms.map(term => term && (
                    <Link
                      key={term.slug}
                      to={`/glossario/${term.slug}`}
                      className="text-sm hover:underline hover:text-primary transition-colors px-2 py-1"
                    >
                      {term.title}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Main content */}
          <div>
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
              {searchQuery && (
                <div className="mt-2 text-sm text-muted-foreground">
                  {filteredTerms.length} {filteredTerms.length === 1 ? 'termo encontrado' : 'termos encontrados'}
                </div>
              )}
            </div>

            {/* Mobile alphabet navigation */}
            <div className="lg:hidden mb-6 flex flex-wrap gap-1">
              {letters.map(letter => (
                <Button 
                  key={letter} 
                  variant="outline" 
                  size="sm"
                  disabled={!hasTermsForLetter[letter]}
                  className={`min-w-[32px] h-8 p-0 ${!hasTermsForLetter[letter] && 'opacity-30'}`}
                  onClick={() => scrollToLetter(letter)}
                >
                  {letter}
                </Button>
              ))}
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
                <div 
                  key={letter} 
                  id={`letter-${letter}`} 
                  className="mb-8"
                  ref={(el) => (sectionRefs.current[letter] = el)}
                >
                  <h2 className="text-2xl font-bold mb-4 border-b pb-2 flex items-center">
                    {letter === '#' ? (
                      <>
                        <Hash className="h-6 w-6 mr-1" /> Números e Símbolos
                      </>
                    ) : (
                      letter
                    )}
                  </h2>
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
        </div>
      </ContentLayout>
    </>
  );
};

export default GlossaryPage;
