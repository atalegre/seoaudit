
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { BarChart, Users, Settings, FileText, Upload } from "lucide-react";
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

const SidebarContent = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const { user } = useUser();
  const isCollapsed = state === "collapsed";
  
  // Determine which items to show based on user role
  const sidebarItems = user?.role === 'client' ? clientSidebarItems : adminSidebarItems;

  return (
    <nav className="space-y-1">
      {sidebarItems.map((item) => (
        <Tooltip key={item.path}>
          <TooltipTrigger asChild>
            <Link 
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                "hover:bg-gray-100/70 hover:backdrop-blur-lg",
                location.pathname === item.path 
                  ? "bg-primary text-primary-foreground" 
                  : "text-sidebar-foreground"
              )}
            >
              {item.icon}
              {!isCollapsed && <span>{item.name}</span>}
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
