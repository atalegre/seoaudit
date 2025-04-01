
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { BarChart, Users, Settings, Bell, Search, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navbar */}
      <header className="bg-white border-b h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="font-bold text-xl text-primary">SEO+AIO Admin</Link>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Pesquisar..." 
              className="w-full pl-8"
            />
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          <div className="flex items-center gap-2 ml-4">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
              <span className="text-sm font-medium">AD</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-muted-foreground">admin@exemplo.com</p>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-gray-50 hidden md:block">
          <nav className="p-4 space-y-1">
            {sidebarItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
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
        </aside>
        
        {/* Main content */}
        <main className="flex-1 p-6 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
