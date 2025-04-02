
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ContentLayout from '@/components/content/ContentLayout';
import { glossaryTerms, relatedTerms } from '@/data/glossary-data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, HelpCircle, ArrowRight, Share2, BookOpen, ExternalLink } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';

const GlossaryTermPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const term = glossaryTerms.find(term => term.slug === slug);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    // If term doesn't exist, redirect to glossary
    if (!term && slug) {
      navigate('/glossario');
    }
  }, [term, slug, navigate]);

  if (!term) {
    return null;
  }

  // Find directly related terms
  const directlyRelated = term.related
    .map(relatedSlug => glossaryTerms.find(t => t.slug === relatedSlug))
    .filter(Boolean);

  // Find terms that reference this term (backlinks)
  const referencingTerms = glossaryTerms
    .filter(t => t.slug !== term.slug && t.related.includes(term.slug))
    .slice(0, 3); // Limit to 3 backlinking terms

  // Create JSON-LD Schema for term
  const termSchemaData = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "name": term.title,
    "description": term.shortDefinition,
    "inDefinedTermSet": {
      "@type": "DefinedTermSet",
      "name": "Glossário SEO+AI",
      "url": "https://seomaisdez.com/glossario"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://seomaisdez.com/glossario/${term.slug}`
    }
  };
  
  // FAQs Schema
  const faqsSchemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": term.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
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
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": term.title,
        "item": `https://seomaisdez.com/glossario/${term.slug}`
      }
    ]
  };

  // Handle sharing the term
  const handleShare = async () => {
    const url = window.location.href;
    const title = `${term.title} - Glossário SEO+AI`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: term.shortDefinition,
          url
        });
      } else {
        // Fallback for browsers that don't support share API
        navigator.clipboard.writeText(url);
        toast.success("Link copiado para área de transferência");
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  };

  // Handle copy citation
  const handleCopyCitation = () => {
    const citation = `"${term.title}" em Glossário SEO+AI, SEO+10, ${new Date().getFullYear()}, disponível em: ${window.location.href}`;
    navigator.clipboard.writeText(citation);
    toast.success("Citação copiada para área de transferência");
  };

  return (
    <>
      <Helmet>
        <title>{`${term.title} | Glossário de SEO e IA`}</title>
        <meta name="description" content={term.shortDefinition} />
        <meta name="keywords" content={`${term.title.toLowerCase()}, ${term.relevance.join(', ').toLowerCase()}, glossário, definição, ${term.related.join(', ')}`} />
        <script type="application/ld+json">
          {JSON.stringify(termSchemaData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqsSchemaData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      
      <ContentLayout className="bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb navigation */}
          <div className="mb-4 text-sm text-muted-foreground flex items-center flex-wrap gap-1">
            <Link to="/" className="hover:text-primary transition-colors">
              Início
            </Link>
            <span className="mx-1">/</span>
            <Link to="/glossario" className="hover:text-primary transition-colors">
              Glossário
            </Link>
            <span className="mx-1">/</span>
            <span className="text-foreground">{term.title}</span>
          </div>
          
          <div className="mb-6 flex justify-between items-center">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/glossario" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Voltar ao Glossário
              </Link>
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center gap-2">
              <Share2 className="h-4 w-4" /> {copySuccess ? "Copiado!" : "Compartilhar"}
            </Button>
          </div>
          
          <article className="prose prose-slate max-w-none">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {term.relevance.includes('SEO') && <Badge className="bg-seo text-primary-foreground">Relevante para SEO</Badge>}
              {term.relevance.includes('AIO') && <Badge className="bg-aio text-primary-foreground">Relevante para AIO</Badge>}
              {term.relevance.includes('IA') && <Badge className="bg-purple-600 text-white">Inteligência Artificial</Badge>}
            </div>

            <h1 className="text-4xl font-bold mb-4 not-prose">{term.title}</h1>
            
            <div className="bg-muted/50 p-4 rounded-lg mb-8 border border-border">
              <p className="text-lg font-medium">{term.shortDefinition}</p>
            </div>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Explicação</h2>
            <div dangerouslySetInnerHTML={{ __html: term.explanation }} />
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Como influencia {term.relevance.join(' e ')}</h2>
            <div dangerouslySetInnerHTML={{ __html: term.influence }} />
            
            <Card className="my-8 not-prose">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" /> Perguntas frequentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {term.faqs.map((faq, index) => (
                    <li key={index} className="p-4 rounded-md bg-background border border-border">
                      <h3 className="font-medium mb-2 text-lg">{faq.question}</h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Combined related terms section */}
            {(directlyRelated.length > 0 || referencingTerms.length > 0) && (
              <div className="mt-8 border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Termos relacionados</h2>
                
                {directlyRelated.length > 0 && (
                  <>
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" /> Para complementar este tema
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {directlyRelated.map((relatedTerm) => (
                        relatedTerm && (
                          <Link 
                            to={`/glossario/${relatedTerm.slug}`} 
                            key={relatedTerm.slug}
                            className="group"
                          >
                            <div className="border rounded-lg p-4 hover:bg-secondary transition-colors">
                              <h3 className="font-medium group-hover:text-primary transition-colors">{relatedTerm.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{relatedTerm.shortDefinition}</p>
                              <span className="text-sm text-primary flex items-center mt-2">
                                Ver termo <ArrowRight className="ml-1 h-3 w-3" />
                              </span>
                            </div>
                          </Link>
                        )
                      ))}
                    </div>
                  </>
                )}

                {referencingTerms.length > 0 && (
                  <>
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" /> Termos que citam este conceito
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {referencingTerms.map((referencingTerm) => (
                        <Link 
                          to={`/glossario/${referencingTerm.slug}`} 
                          key={referencingTerm.slug}
                          className="group"
                        >
                          <div className="border rounded-lg p-4 hover:bg-secondary transition-colors">
                            <h3 className="font-medium group-hover:text-primary transition-colors">{referencingTerm.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{referencingTerm.shortDefinition}</p>
                            <span className="text-sm text-primary flex items-center mt-2">
                              Ver termo <ArrowRight className="ml-1 h-3 w-3" />
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            
            <div className="mt-8 p-4 bg-secondary/40 rounded-lg border border-secondary">
              <h3 className="font-medium mb-2">Citação sugerida</h3>
              <p className="text-sm mb-2">Para citar este termo em seus conteúdos:</p>
              <div className="bg-muted p-3 rounded text-xs font-mono">
                <code>"{term.title}" em Glossário SEO+AI, SEO+10, {new Date().getFullYear()}, disponível em: {window.location.href}</code>
              </div>
              <Button variant="outline" size="sm" onClick={handleCopyCitation} className="mt-2">
                Copiar citação
              </Button>
            </div>

            {/* Updated footer section with more context for AI readers */}
            <div className="mt-12 bg-muted/30 p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-2">Sobre este glossário</h3>
              <p className="mb-3">
                Este termo faz parte do Glossário SEO+AI, uma coleção curada de definições e explicações sobre SEO e Otimização para Inteligência Artificial. 
              </p>
              <p className="mb-3">
                Nosso objetivo é fornecer informações precisas, atualizadas e contextualizadas para profissionais de marketing digital, desenvolvedores e gestores de conteúdo.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <Link to="/glossario">
                  <Button variant="outline" size="sm">
                    Explorar todo o glossário
                  </Button>
                </Link>
                <Link to="/contato">
                  <Button variant="outline" size="sm">
                    Sugerir um termo
                  </Button>
                </Link>
              </div>
            </div>
          </article>
        </div>
      </ContentLayout>
    </>
  );
};

export default GlossaryTermPage;
