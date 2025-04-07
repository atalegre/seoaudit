
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { BarChart, Users, Settings, FileText, Upload, LineChart, Globe, Bot, MapPin, Search, Pen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebar } from '@/components/ui/sidebar/context';
import { useUser } from '@/contexts/UserContext';

// Define different sidebar items based on user role
export const adminSidebarItems = [
  { name: "Dashboard", path: "/dashboard", icon: <BarChart className="w-5 h-5" /> },
  { name: "Clientes", path: "/dashboard/clients", icon: <Users className="w-5 h-5" /> },
  { name: "Importação em Massa", path: "/dashboard/bulk-import", icon: <Upload className="w-5 h-5" /> },
  { name: "Blog", path: "/dashboard/blog-posts", icon: <FileText className="w-5 h-5" /> },
  { name: "Configurações", path: "/dashboard/settings", icon: <Settings className="w-5 h-5" /> },
];

export const clientSidebarItems = [
  { name: "Dashboard", path: "/dashboard/client", icon: <BarChart className="w-5 h-5" /> },
  { name: "Relatórios", path: "/dashboard/client/reports", icon: <FileText className="w-5 h-5" /> },
  { name: "Configurações", path: "/dashboard/client/settings", icon: <Settings className="w-5 h-5" /> },
];

// Suite section sidebar items
export const suiteSidebarItems = [
  { name: "Dashboard", path: "/suite", icon: <BarChart className="w-5 h-5" /> },
  { name: "SEO Analysis", path: "/suite/seo", icon: <LineChart className="w-5 h-5" /> },
  { name: "AI Optimization", path: "/suite/aio", icon: <Bot className="w-5 h-5" /> },
  { name: "LLM Readiness", path: "/suite/llm", icon: <Bot className="w-5 h-5" /> },
  { name: "Local Directories", path: "/suite/directories", icon: <MapPin className="w-5 h-5" /> },
  { name: "Keywords", path: "/suite/keywords", icon: <Search className="w-5 h-5" /> },
  { name: "Content Writer", path: "/suite/writer", icon: <Pen className="w-5 h-5" /> },
  { name: "Reports", path: "/suite/reports", icon: <FileText className="w-5 h-5" /> },
  { name: "Settings", path: "/suite/settings", icon: <Settings className="w-5 h-5" /> },
];

const SidebarContent = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const { user } = useUser();
  const isCollapsed = state === "collapsed";
  
  // Determine which items to show based on the current path
  const isSuitePath = location.pathname.startsWith('/suite');
  const isDashboardPath = location.pathname.startsWith('/dashboard');
  
  let sidebarItems;
  
  if (isSuitePath) {
    // Show suite menu when in suite routes
    sidebarItems = suiteSidebarItems;
  } else if (isDashboardPath) {
    // Show dashboard menu based on user role when in dashboard routes
    sidebarItems = user?.role === 'client' ? clientSidebarItems : adminSidebarItems;
  } else {
    // Default to admin sidebar for other routes
    sidebarItems = adminSidebarItems;
  }

  return (
    <nav className="space-y-1">
      {sidebarItems.map((item) => (
        <Tooltip key={item.path}>
          <TooltipTrigger asChild>
            <Link 
              to={item.path}
              className={cn(
                "flex items-center justify-center gap-2 px-2 py-2 rounded-md text-sm transition-colors",
                "hover:bg-gray-100/70 hover:backdrop-blur-lg",
                !isCollapsed && "flex-col",
                location.pathname === item.path 
                  ? "bg-primary text-primary-foreground" 
                  : "text-sidebar-foreground"
              )}
            >
              {item.icon}
              {!isCollapsed && <span className="text-xs text-center mt-1">{item.name}</span>}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            {item.name}
          </TooltipContent>
        </Tooltip>
      ))}
    </nav>
  );
};

export default SidebarContent;
