
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const BlogSidebar = () => {
  const { language } = useLanguage();
  
  return (
    <div className="space-y-6">
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">{language === 'pt' ? 'Precisa de ajuda?' : 'Need help?'}</h3>
          <p className="text-sm mb-4">{language === 'pt' ? 
            'Agende uma consulta gratuita com os nossos especialistas em SEO e AIO.' : 
            'Schedule a free consultation with our SEO and AIO experts.'}</p>
          <Button asChild variant="secondary" className="w-full">
            <Link to="/contacto" className="flex items-center justify-center gap-2">
              {language === 'pt' ? 'Fale Conosco' : 'Contact Us'} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogSidebar;
