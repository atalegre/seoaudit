
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

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
