
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { BarChart, Users, Settings, Bell, Search, Upload, FileText, Menu, UserCircle, LogOut, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const sidebarItems = [
  { name: "Dashboard", path: "/dashboard", icon: <BarChart className="w-5 h-5" /> },
  { name: "Clientes", path: "/dashboard/clients", icon: <Users className="w-5 h-5" /> },
  { name: "Importação em Massa", path: "/dashboard/bulk-import", icon: <Upload className="w-5 h-5" /> },
  { name: "Blog", path: "/dashboard/blog-posts", icon: <FileText className="w-5 h-5" /> },
  { name: "Configurações", path: "/dashboard/settings", icon: <Settings className="w-5 h-5" /> },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [user, setUser] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('AD');
  
  // Check if user is logged in and get user info
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        setUserEmail(session.user.email || 'admin@exemplo.com');
        
        // Get user name from user metadata if available
        const fullName = session.user.user_metadata?.full_name;
        if (fullName) {
          setUserName(getInitials(fullName));
        }
      } else {
        navigate('/signin');
      }
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          navigate('/signin');
        } else if (session) {
          setUser(session.user);
          setUserEmail(session.user.email || 'admin@exemplo.com');
          
          // Get user name from user metadata if available
          const fullName = session.user.user_metadata?.full_name;
          if (fullName) {
            setUserName(getInitials(fullName));
          }
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  
  // Precarregar rotas quando o usuário passa o mouse sobre os links (para desktop)
  useEffect(() => {
    // Preload function only for desktop
    if (isMobile) return;
    
    const preloadRoutes = () => {
      // Preload routes based on current page
      const currentPathParts = location.pathname.split('/');
      const basePath = currentPathParts[1] || 'dashboard';
      
      // Dynamically import neighbor routes
      import(`../../pages/${basePath === 'dashboard' ? 'dashboard/DashboardPage' : 'Index'}.tsx`)
        .catch(error => console.log('Preloading routes in background'));
    };
    
    // Delay preloading to not interfere with initial render
    const timer = setTimeout(preloadRoutes, 2000);
    
    return () => clearTimeout(timer);
  }, [location.pathname, isMobile]);
  
  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout bem-sucedido",
        description: "Você foi desconectado com sucesso.",
      });
      navigate('/signin');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: error.message,
      });
    }
  };
  
  const SidebarContent = () => (
    <nav className="p-4 space-y-1">
      {sidebarItems.map((item) => (
        <Link 
          key={item.path} 
          to={item.path}
          onClick={() => setIsMobileMenuOpen(false)}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
            location.pathname === item.path 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-gray-100"
          )}
        >
          {item.icon}
          <span>{item.name}</span>
        </Link>
      ))}
    </nav>
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navbar */}
      <header className="bg-white border-b h-14 md:h-16 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          {isMobile && (
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="p-4 border-b">
                  <Link to="/dashboard" className="font-bold text-lg text-primary">
                    SEOAudit Admin
                  </Link>
                </div>
                <SidebarContent />
              </SheetContent>
            </Sheet>
          )}
          
          <Link to="/dashboard" className="font-bold text-xl text-primary">
            {isMobile ? "SEOAudit" : "SEOAudit Admin"}
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          {!isMobile && (
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Pesquisar..." 
                className="w-full pl-8"
              />
            </div>
          )}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          {/* User dropdown menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 ml-2 md:ml-4 cursor-pointer">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary text-white flex items-center justify-center">
                  <span className="text-xs md:text-sm font-medium">{userName}</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user?.user_metadata?.full_name || 'Admin'}</p>
                  <p className="text-xs text-muted-foreground">{userEmail}</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/dashboard/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/dashboard/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/dashboard/change-password')}>
                <Lock className="mr-2 h-4 w-4" />
                <span>Alterar senha</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        {!isMobile && (
          <aside className="w-64 border-r bg-gray-50 hidden md:block">
            <SidebarContent />
          </aside>
        )}
        
        {/* Main content */}
        <main className="flex-1 p-3 md:p-6 bg-white overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
