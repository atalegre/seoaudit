
import React from 'react';
import { SearchConsoleData } from '@/utils/api/searchConsole/types';

interface QueriesTableProps {
  queries: SearchConsoleData['queries'];
}

const QueriesTable: React.FC<QueriesTableProps> = ({ queries }) => {
  if (!queries || queries.length === 0) return null;

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-500 mb-2">Detalhes por consulta</h3>
      <div className="overflow-auto max-h-64 border rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consulta</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliques</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impressões</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posição</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {queries.map((query, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{query.query}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{query.clicks}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{query.impressions}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(query.ctr * 100).toFixed(2)}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{query.position.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QueriesTable;
