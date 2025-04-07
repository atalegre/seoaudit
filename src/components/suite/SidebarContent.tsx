
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { BarChart, LineChart, Bot, MapPin, Search, Pen, FileText, Settings, Globe } from "lucide-react";
import { useUser } from '@/contexts/UserContext';

// Define different sidebar items based on user role
export const adminSidebarItems = [
  { name: "Dashboard", path: "/dashboard", icon: <BarChart className="w-5 h-5" /> },
  { name: "Clientes", path: "/dashboard/clients", icon: <Globe className="w-5 h-5" /> },
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
  const { user } = useUser();
  
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
    <>
      {sidebarItems.map((item) => (
        <Link 
          key={item.path}
          to={item.path}
          className={cn(
            "flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium text-gray-800 hover:bg-gray-100",
            location.pathname === item.path && "bg-gray-100 text-primary"
          )}
        >
          {item.icon}
          <span className="hidden group-hover:inline">{item.name}</span>
        </Link>
      ))}
    </>
  );
};

export default SidebarContent;
