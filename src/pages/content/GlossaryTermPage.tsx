
import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ContentLayout from '@/components/content/ContentLayout';
import { glossaryTerms, relatedTerms } from '@/data/glossary-data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, HelpCircle, ArrowRight } from 'lucide-react';

const GlossaryTermPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const term = glossaryTerms.find(term => term.slug === slug);

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

  // Find related terms
  const related = term.related.map(
    relatedSlug => glossaryTerms.find(t => t.slug === relatedSlug)
  ).filter(Boolean);

  return (
    <ContentLayout className="bg-secondary/30">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/glossario" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Voltar ao Glossário
            </Link>
          </Button>
        </div>
        
        <article className="prose prose-slate max-w-none">
          <div className="flex items-center gap-2 mb-4">
            {term.relevance.includes('SEO') && <Badge className="bg-seo text-primary-foreground">Relevante para SEO</Badge>}
            {term.relevance.includes('AIO') && <Badge className="bg-aio text-primary-foreground">Relevante para AIO</Badge>}
          </div>

          <h1 className="text-4xl font-bold mb-4 not-prose">{term.title}</h1>
          
          <div className="bg-muted/50 p-4 rounded-lg mb-8">
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
                  <li key={index}>
                    <h3 className="font-medium mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {related.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Termos relacionados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {related.map((relatedTerm) => (
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
            </div>
          )}
        </article>
      </div>
    </ContentLayout>
  );
};

export default GlossaryTermPage;
