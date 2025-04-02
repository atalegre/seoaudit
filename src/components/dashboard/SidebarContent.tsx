
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { BarChart, Users, Settings, FileText, Upload } from "lucide-react";

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

interface SidebarContentProps {
  items: typeof adminSidebarItems;
  onMobileMenuClose?: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ items, onMobileMenuClose }) => {
  const location = useLocation();

  return (
    <nav className="p-4 space-y-1">
      {items.map((item) => (
        <Link 
          key={item.path} 
          to={item.path}
          onClick={onMobileMenuClose}
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
};

export default SidebarContent;
