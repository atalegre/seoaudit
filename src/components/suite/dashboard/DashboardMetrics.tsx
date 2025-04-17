
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';

const DashboardMetrics = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Métricas de desempenho</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex justify-between mb-2">
              <h3 className="text-sm font-medium">Velocidade de carregamento</h3>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Bom</span>
            </div>
            <div className="flex items-end">
              <span className="text-2xl font-bold">2.8s</span>
              <span className="text-sm text-gray-500 ml-1 mb-1">Desktop</span>
            </div>
            <div className="mt-2 flex items-end">
              <span className="text-2xl font-bold">3.9s</span>
              <span className="text-sm text-gray-500 ml-1 mb-1">Mobile</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex justify-between mb-2">
              <h3 className="text-sm font-medium">Core Web Vitals</h3>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">A melhorar</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <div className="text-sm text-gray-500">LCP</div>
                <div className="text-xl font-medium">2.5s</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">FID</div>
                <div className="text-xl font-medium">100ms</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">CLS</div>
                <div className="text-xl font-medium">0.12</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex justify-between mb-2">
              <h3 className="text-sm font-medium">Visibilidade</h3>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">45 URLs indexadas</span>
            </div>
            <div className="mt-1">
              <div className="flex justify-between text-sm">
                <span>Mobile-friendly</span>
                <span className="text-green-600">Sim</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>HTTPS</span>
                <span className="text-green-600">Ativo</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Schema markup</span>
                <span className="text-yellow-600">Parcial</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardMetrics;
