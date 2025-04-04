
import React from 'react';
import { SearchConsoleData } from '@/utils/api/searchConsoleService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SearchConsoleSectionProps {
  data: SearchConsoleData | null;
  isLoading?: boolean;
  error?: string | null;
}

const SearchConsoleSection = ({ data, isLoading, error }: SearchConsoleSectionProps) => {
  if (isLoading) {
    return (
      <Card className="w-full mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Dados do Search Console</CardTitle>
          <CardDescription>Carregando dados de tráfego...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Dados do Search Console</CardTitle>
          <CardDescription>Erro ao carregar dados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="w-full mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Dados do Search Console</CardTitle>
          <CardDescription>Configure o Google Search Console para ver os dados de tráfego</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-gray-50 text-gray-600 rounded-md">
            Para visualizar os dados de tráfego, configure a integração com o Google Search Console
            nas configurações do sistema.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Dados do Search Console</CardTitle>
        <CardDescription>
          Dados de {data.startDate} até {data.endDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Cliques</p>
            <p className="text-2xl font-bold">{data.clicks.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Impressões</p>
            <p className="text-2xl font-bold">{data.impressions.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">CTR</p>
            <p className="text-2xl font-bold">{(data.ctr * 100).toFixed(2)}%</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Posição média</p>
            <p className="text-2xl font-bold">{data.position.toFixed(1)}</p>
          </div>
        </div>

        {data.queries && data.queries.length > 0 ? (
          <>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Principais consultas</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.queries}
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
                    {data.queries.map((query, index) => (
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
          </>
        ) : (
          <div className="p-4 bg-gray-50 text-gray-600 rounded-md">
            Não há dados de consultas disponíveis para o período selecionado.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchConsoleSection;
