
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  Sparkles,
  BrainCircuit,
  MapPin,
  Search,
  Lightbulb,
  FileText,
  BarChart2,
  Pen
} from 'lucide-react';

const SidebarContentItems = () => {
  // Array of links for the sidebar
  const links = [
    {
      to: '/suite',
      icon: <BarChart3 className="h-4 w-4" />,
      label: 'Dashboard'
    },
    {
      to: '/suite/seo',
      icon: <BarChart2 className="h-4 w-4" />,
      label: 'SEO Analysis'
    },
    {
      to: '/suite/aio',
      icon: <Sparkles className="h-4 w-4" />,
      label: 'AI Optimization'
    },
    {
      to: '/suite/llm',
      icon: <BrainCircuit className="h-4 w-4" />,
      label: 'LLM Presence'
    },
    {
      to: '/suite/directories',
      icon: <MapPin className="h-4 w-4" />,
      label: 'Local Directories'
    },
    {
      to: '/suite/keywords',
      icon: <Search className="h-4 w-4" />,
      label: 'Keyword Research'
    },
    {
      to: '/suite/recommender',
      icon: <Lightbulb className="h-4 w-4" />,
      label: 'Content Recommender'
    },
    {
      to: '/suite/writer',
      icon: <Pen className="h-4 w-4" />,
      label: 'Content Writer'
    },
    {
      to: '/suite/reports',
      icon: <FileText className="h-4 w-4" />,
      label: 'Reports'
    }
  ];

  return (
    <>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex items-center h-9 px-2 rounded-md text-xs hover:bg-gray-100 transition-colors ${
              isActive ? 'bg-gray-100 font-medium' : 'text-gray-700'
            }`
          }
        >
          <span className="mr-2">{link.icon}</span>
          <span className="sidebar-label">{link.label}</span>
        </NavLink>
      ))}
    </>
  );
};

export default SidebarContentItems;
