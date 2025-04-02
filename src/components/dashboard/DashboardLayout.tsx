
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
import { checkUserRole } from '@/utils/auth/authService';

// Define different sidebar items based on user role
const adminSidebarItems = [
  { name: "Dashboard", path: "/dashboard", icon: <BarChart className="w-5 h-5" /> },
  { name: "Clientes", path: "/dashboard/clients", icon: <Users className="w-5 h-5" /> },
  { name: "Importação em Massa", path: "/dashboard/bulk-import", icon: <Upload className="w-5 h-5" /> },
  { name: "Blog", path: "/dashboard/blog-posts", icon: <FileText className="w-5 h-5" /> },
  { name: "Configurações", path: "/dashboard/settings", icon: <Settings className="w-5 h-5" /> },
];

const clientSidebarItems = [
  { name: "Dashboard", path: "/dashboard/client", icon: <BarChart className="w-5 h-5" /> },
  { name: "Relatórios", path: "/dashboard/client/reports", icon: <FileText className="w-5 h-5" /> },
  { name: "Configurações", path: "/dashboard/client/settings", icon: <Settings className="w-5 h-5" /> },
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
  const [userRole, setUserRole] = useState<string>('user');
  const [isLoading, setIsLoading] = useState(true);
  
  // Use appropriate sidebar items based on role
  const sidebarItems = userRole === 'admin' ? adminSidebarItems : clientSidebarItems;
  
  // Check if user is logged in and get user info
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
          setUserEmail(session.user.email || '');
          
          // Get user name from user metadata if available
          const fullName = session.user.user_metadata?.full_name;
          if (fullName) {
            setUserName(getInitials(fullName));
          }
          
          // Get user role
          const role = await checkUserRole(session.user.id);
          setUserRole(role);
          
          // Check access permissions
          const pathParts = location.pathname.split('/');
          if (pathParts[1] === 'dashboard') {
            if (pathParts[2] === undefined && role !== 'admin') {
              // Non-admins trying to access main dashboard should be redirected
              navigate('/dashboard/client');
            } else if (role === 'admin' && pathParts[2] === 'client' && !pathParts[3]) {
              // Admins can view client dashboard if they explicitly go there
              // No redirect needed here
            }
          }
        } else {
          navigate('/signin');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/signin');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          navigate('/signin');
        } else if (session) {
          setUser(session.user);
          setUserEmail(session.user.email || '');
          
          // Get user name from user metadata if available
          const fullName = session.user.user_metadata?.full_name;
          if (fullName) {
            setUserName(getInitials(fullName));
          }
          
          // Update role
          const role = await checkUserRole(session.user.id);
          setUserRole(role);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);
  
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

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }
  
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
                  <Link to={userRole === 'admin' ? "/dashboard" : "/dashboard/client"} className="font-bold text-lg text-primary">
                    SEOAudit {userRole === 'admin' ? 'Admin' : 'Client'}
                  </Link>
                </div>
                <SidebarContent />
              </SheetContent>
            </Sheet>
          )}
          
          <Link to={userRole === 'admin' ? "/dashboard" : "/dashboard/client"} className="font-bold text-xl text-primary">
            {isMobile ? "SEOAudit" : `SEOAudit ${userRole === 'admin' ? 'Admin' : 'Client'}`}
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
                  <p className="text-sm font-medium">{user?.user_metadata?.full_name || (userRole === 'admin' ? 'Admin' : 'Cliente')}</p>
                  <p className="text-xs text-muted-foreground">{userEmail}</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha conta ({userRole})</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(userRole === 'admin' ? '/dashboard/profile' : '/dashboard/client/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(userRole === 'admin' ? '/dashboard/settings' : '/dashboard/client/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(userRole === 'admin' ? '/dashboard/change-password' : '/dashboard/client/change-password')}>
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
