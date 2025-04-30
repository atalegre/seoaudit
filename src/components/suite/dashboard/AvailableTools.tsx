
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Sparkles, MapPin, FileText, Ban } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import BlurredSection from './BlurredSection';

const AvailableTools = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  
  // Remove all tools that we want to hide
  const tools = [
    {
      title: 'SEO Analysis',
      description: 'Analyze your website for SEO issues',
      icon: <BarChart className="h-6 w-6" />,
      color: 'bg-blue-50 text-blue-600',
      path: '/suite/seo',
      restricted: false
    },
    {
      title: 'AI Optimization',
      description: 'Optimize your content for AI discovery',
      icon: <Sparkles className="h-6 w-6" />,
      color: 'bg-purple-50 text-purple-600',
      path: '/suite/aio',
      restricted: true
    },
    {
      title: 'Local Directories',
      description: 'Check your local directory presence',
      icon: <MapPin className="h-6 w-6" />,
      color: 'bg-red-50 text-red-600',
      path: '/suite/directories',
      restricted: true
    },
    {
      title: 'Reports',
      description: 'View comprehensive reports and analysis',
      icon: <FileText className="h-6 w-6" />,
      color: 'bg-gray-50 text-gray-600',
      path: '/suite/reports',
      restricted: true
    }
  ];
  
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools.map((tool, index) => {
        const ToolCard = (
          <Card key={index} className="bg-white shadow-md">
            <CardContent className="flex flex-col items-start p-4 space-y-3">
              <div className={`w-10 h-10 rounded-md flex items-center justify-center ${tool.color} relative`}>
                {tool.icon}
                {tool.restricted && !user && (
                  <Ban className="h-4 w-4 absolute -top-1 -right-1 text-gray-500 bg-white rounded-full p-0.5" />
                )}
              </div>
              <h3 className="font-semibold text-lg">{tool.title}</h3>
              <p className="text-sm text-gray-500">{tool.description}</p>
              <Button variant="secondary" size="sm" onClick={() => navigate(tool.path)}>
                Verificar
              </Button>
            </CardContent>
          </Card>
        );
        
        // If tool is restricted and user is not logged in, wrap it in BlurredSection
        if (tool.restricted && !user) {
          return (
            <BlurredSection 
              key={index} 
              noBackdrop={true}
              path={tool.path}
            >
              {ToolCard}
            </BlurredSection>
          );
        }
        
        return ToolCard;
      })}
    </div>
  );
};

export default AvailableTools;
