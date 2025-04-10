
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SearchConsoleData } from '@/utils/api/searchConsole/types';

interface QueriesChartProps {
  queries: SearchConsoleData['queries'];
}

const QueriesChart: React.FC<QueriesChartProps> = ({ queries }) => {
  if (!queries || queries.length === 0) {
    return (
      <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm border border-gray-100 text-gray-600 flex items-center justify-center">
        <p>Não há dados de consultas disponíveis para o período selecionado.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Principais consultas</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={queries}
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            barGap={8}
            barSize={24}
          >
            <defs>
              <linearGradient id="impressionsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis 
              dataKey="query" 
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
              stroke="#9ca3af"
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              stroke="#9ca3af" 
              fontSize={10} 
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
            />
            <Tooltip 
              formatter={(value, name) => [value, name === 'impressions' ? 'Impressões' : 'Cliques']}
              labelFormatter={(label) => `Consulta: ${label}`}
              contentStyle={{ 
                fontSize: '12px', 
                borderRadius: '8px', 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey="impressions" 
              name="Impressões" 
              fill="url(#impressionsGradient)" 
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              dataKey="clicks" 
              name="Cliques" 
              fill="url(#clicksGradient)" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default QueriesChart;
