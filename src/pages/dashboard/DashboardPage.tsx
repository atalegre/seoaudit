
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Users, Activity, BarChart3, ListChecks, TrendingUp } from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    // Welcome toast without authentication check
    toast({
      title: 'Bem-vindo ao Dashboard de Administração',
      description: 'Gerencie clientes, conteúdos e configurações do sistema.'
    });
  }, [toast]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold tracking-tight mb-4">Dashboard de Administração</h1>
      <p className="text-muted-foreground mb-6">
        Gerencie clientes, conteúdos e configurações do sistema.
      </p>
      
      {/* Statistics Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total de Clientes</p>
              <div className="text-3xl font-bold mt-1">68</div>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <Users className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-2 text-xs text-green-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>+12% desde o mês passado</span>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Visualizações</p>
              <div className="text-3xl font-bold mt-1">562</div>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-2 text-xs text-blue-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>+8% desde a semana passada</span>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Novos Relatórios</p>
              <div className="text-3xl font-bold mt-1">892</div>
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-2 text-xs text-purple-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>+15% desde o início do mês</span>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Recomendações Implementadas</p>
              <div className="text-3xl font-bold mt-1">42</div>
            </div>
            <div className="bg-amber-100 p-2 rounded-full">
              <ListChecks className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <div className="flex items-center mt-2 text-xs text-amber-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>+5% desde a última semana</span>
          </div>
        </Card>
      </div>
      
      {/* Navigation Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border rounded-lg shadow-sm p-6">
          <h2 className="font-semibold text-lg mb-2">Clientes</h2>
          <p className="text-muted-foreground text-sm mb-4">Gerencie os clientes da plataforma</p>
          <button 
            onClick={() => navigate('/dashboard/clients')}
            className="text-sm text-primary hover:underline"
          >
            Ver clientes →
          </button>
        </div>
        
        <div className="bg-white border rounded-lg shadow-sm p-6">
          <h2 className="font-semibold text-lg mb-2">Importação</h2>
          <p className="text-muted-foreground text-sm mb-4">Importe clientes em massa</p>
          <button 
            onClick={() => navigate('/dashboard/bulk-import')}
            className="text-sm text-primary hover:underline"
          >
            Importar clientes →
          </button>
        </div>
        
        <div className="bg-white border rounded-lg shadow-sm p-6">
          <h2 className="font-semibold text-lg mb-2">Blog</h2>
          <p className="text-muted-foreground text-sm mb-4">Crie e edite postagens do blog</p>
          <button 
            onClick={() => navigate('/dashboard/blog-posts')}
            className="text-sm text-primary hover:underline"
          >
            Gerenciar blog →
          </button>
        </div>
        
        <div className="bg-white border rounded-lg shadow-sm p-6">
          <h2 className="font-semibold text-lg mb-2">Configurações</h2>
          <p className="text-muted-foreground text-sm mb-4">Configure integrações e APIs</p>
          <button 
            onClick={() => navigate('/dashboard/settings')}
            className="text-sm text-primary hover:underline"
          >
            Configurar →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
