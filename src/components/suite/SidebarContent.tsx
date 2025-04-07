
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Settings, Bot, Globe, MapPin, 
  KeySquare, Brain, Pencil, FileText, 
  Home
} from 'lucide-react';
import { 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarGroupContent 
} from "@/components/ui/sidebar";

export const sidebarItems = [
  {
    icon: Home,
    label: 'Dashboard',
    path: '/suite',
    tooltip: 'Visão geral'
  },
  {
    icon: Settings,
    label: 'SEO Analysis',
    path: '/suite/seo',
    tooltip: 'SEO técnico'
  },
  {
    icon: Bot,
    label: 'AIO',
    path: '/suite/aio',
    tooltip: 'Clareza para IA'
  },
  {
    icon: Globe,
    label: 'LLM Presence',
    path: '/suite/llm',
    tooltip: 'Presença em IA'
  },
  {
    icon: MapPin,
    label: 'Diretórios',
    path: '/suite/directories',
    tooltip: 'Presença local'
  },
  {
    icon: KeySquare,
    label: 'Keyword Tracker',
    path: '/suite/keywords',
    tooltip: 'Ranking e keywords'
  },
  {
    icon: Brain,
    label: 'Recomendador',
    path: '/suite/recommender',
    tooltip: 'Sugestões automáticas'
  },
  {
    icon: Pencil,
    label: 'Writer Assistant',
    path: '/suite/writer',
    tooltip: 'Criação de conteúdos'
  },
  {
    icon: FileText,
    label: 'Relatórios',
    path: '/suite/reports',
    tooltip: 'Histórico PDF / logs'
  }
];

const SidebarContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <SidebarGroupContent className="py-1">
      <SidebarMenu className="space-y-0.5">
        {sidebarItems.map((item) => (
          <SidebarMenuItem key={item.path}>
            <SidebarMenuButton
              tooltip={item.tooltip}
              isActive={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              className="h-8 py-1.5"
              size="sm"
            >
              <item.icon className="w-4 h-4 mr-2" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  );
};

export default SidebarContent;
