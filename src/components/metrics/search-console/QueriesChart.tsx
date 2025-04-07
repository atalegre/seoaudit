
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SearchConsoleData } from '@/utils/api/searchConsole/types';

interface QueriesChartProps {
  queries: SearchConsoleData['queries'];
}

const QueriesChart: React.FC<QueriesChartProps> = ({ queries }) => {
  if (!queries || queries.length === 0) {
    return (
      <div className="p-4 bg-gray-50 text-gray-600 rounded-md">
        Não há dados de consultas disponíveis para o período selecionado.
      </div>
    );
  }

  return (
    <>
      <h3 className="text-sm font-medium text-gray-500 mb-3">Principais consultas</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={queries}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="query" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
            />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [value, name === 'impressions' ? 'Impressões' : 'Cliques']}
              labelFormatter={(label) => `Consulta: ${label}`}
            />
            <Bar dataKey="impressions" name="Impressões" fill="#94a3b8" />
            <Bar dataKey="clicks" name="Cliques" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default QueriesChart;
