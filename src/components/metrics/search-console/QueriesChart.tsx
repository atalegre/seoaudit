
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
      <h3 className="text-sm font-medium text-gray-500 mb-2">Principais consultas</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={queries}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="query" 
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => value.length > 12 ? `${value.substring(0, 12)}...` : value}
              stroke="#9ca3af"
            />
            <YAxis stroke="#9ca3af" fontSize={10} />
            <Tooltip 
              formatter={(value, name) => [value, name === 'impressions' ? 'Impressões' : 'Cliques']}
              labelFormatter={(label) => `Consulta: ${label}`}
              contentStyle={{ fontSize: '12px', borderRadius: '6px' }}
            />
            <Bar dataKey="impressions" name="Impressões" fill="#9b87f5" />
            <Bar dataKey="clicks" name="Cliques" fill="#0EA5E9" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default QueriesChart;
