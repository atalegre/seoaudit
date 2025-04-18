
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Sparkles,
  MapPin,
  BarChart2,
  Home,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';

const SidebarContentItems = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  
  // Array of links for the sidebar - removed LLM, Keywords, Content Recommender, Content Writer
  const links = [
    {
      to: '/suite',
      icon: <Home className="h-5 w-5" />,
      label: 'Dashboard',
      color: 'text-indigo-600',
      protected: false
    },
    {
      to: '/suite/seo',
      icon: <BarChart2 className="h-5 w-5" />,
      label: 'SEO Analysis',
      color: 'text-blue-600',
      protected: false
    },
    {
      to: '/suite/aio',
      icon: <Sparkles className="h-5 w-5" />,
      label: 'AI Optimization',
      color: 'text-purple-600',
      protected: true
    },
    {
      to: '/suite/directories',
      icon: <MapPin className="h-5 w-5" />,
      label: 'Local Directories',
      color: 'text-red-600',
      protected: true
    },
    {
      to: '/suite/reports',
      icon: <BarChart3 className="h-5 w-5" />,
      label: 'Reports',
      color: 'text-gray-600',
      protected: true
    }
  ];

  return (
    <div className="flex flex-col space-y-2">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center w-10 h-10 mx-auto rounded-lg",
              "transition-colors duration-200 relative group cursor-pointer",
              isActive 
                ? "bg-indigo-100 text-indigo-700" 
                : "text-gray-500 hover:bg-indigo-50"
            )
          }
          title={link.label}
        >
          {({ isActive }) => (
            <>
              <div className={cn(
                isActive ? link.color : "text-inherit",
                "group-hover:text-inherit group-hover:" + link.color,
                "relative"
              )}>
                {link.icon}
                {link.protected && !user && (
                  <Lock className="w-3 h-3 absolute -top-1 -right-1 text-gray-400" />
                )}
              </div>
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity whitespace-nowrap z-50">
                {link.label}
                {link.protected && !user && " (Login required)"}
              </div>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
};

export default SidebarContentItems;
