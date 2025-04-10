
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardCard = () => {
  const { language } = useLanguage();
  
  return (
    <div className="p-6 rounded-xl border border-gray-100 hover:border-violet-100 transition-all duration-300 hover:shadow-md bg-white">
      <div className="flex flex-col h-full">
        <div className="mb-6 bg-green-50 w-16 h-16 rounded-full flex items-center justify-center">
          <LayoutDashboard className="h-8 w-8 text-green-600" />
        </div>
        
        <h3 className="text-xl font-bold mb-3">
          {language === 'pt' ? 'Dashboard Completo' : 'Complete Dashboard'}
        </h3>
        
        <p className="text-gray-600 mb-6 flex-grow">
          {language === 'pt'
            ? 'Acesso a um painel de controle completo com análises detalhadas, recomendações e ferramentas avançadas.'
            : 'Access to a complete dashboard with detailed analysis, recommendations and advanced tools.'}
        </p>
        
        <Button variant="outline" className="w-full mt-auto" asChild>
          <Link to="/suite">
            {language === 'pt' ? 'Explorar' : 'Explore'}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default DashboardCard;
