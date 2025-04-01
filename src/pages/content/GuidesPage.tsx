
import React from 'react';
import { Link } from 'react-router-dom';
import ContentLayout from '@/components/content/ContentLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight } from 'lucide-react';
import { guides } from '@/data/guides-data';
import { Badge } from '@/components/ui/badge';

const GuidesPage = () => {
  return (
    <ContentLayout className="bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-4 mb-12">
          <h1 className="text-4xl font-bold">Guias SEO+AI</h1>
          <p className="text-lg text-muted-foreground">
            Recursos completos e práticos para melhorar sua presença online
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((guide) => (
            <Link to={`/guias/${guide.slug}`} key={guide.slug}>
              <Card className="h-full overflow-hidden hover:border-primary transition-colors hover:shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex gap-2 mb-2">
                    {guide.relevance.includes('SEO') && <Badge className="bg-seo text-primary-foreground">SEO</Badge>}
                    {guide.relevance.includes('AIO') && <Badge className="bg-aio text-primary-foreground">AIO</Badge>}
                  </div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <FileText className="h-5 w-5" />
                    {guide.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{guide.description}</CardDescription>
                </CardContent>
                <CardFooter className="flex justify-between items-center border-t pt-4">
                  <div className="text-sm text-muted-foreground">
                    {guide.items} items · {guide.readTime} min de leitura
                  </div>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    Ver guia <ArrowRight className="h-3 w-3" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-seo-light to-aio-light">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-3">Precisa de ajuda personalizada?</h2>
                  <p className="mb-4">Nossa equipe de especialistas pode criar uma estratégia personalizada para as suas necessidades específicas.</p>
                  <Button asChild>
                    <Link to="/contacto">Fale Conosco</Link>
                  </Button>
                </div>
                <div className="w-32 h-32 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-6xl">🚀</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ContentLayout>
  );
};

export default GuidesPage;
