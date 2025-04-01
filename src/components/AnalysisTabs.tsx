
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Clock, Smartphone, Image, FileText, Shield, CheckCircle2, XCircle } from 'lucide-react';
import { SeoAnalysis, AioAnalysis, CombinedRecommendation } from '@/utils/analyzerUtils';

interface AnalysisTabsProps {
  seoData: SeoAnalysis;
  aioData: AioAnalysis;
  recommendations: CombinedRecommendation[];
}

const AnalysisTabs: React.FC<AnalysisTabsProps> = ({ 
  seoData, 
  aioData, 
  recommendations 
}) => {
  return (
    <Tabs defaultValue="seo" className="w-full animate-fade-in" style={{ animationDelay: '300ms' }}>
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="seo" className="text-seo">Análise SEO</TabsTrigger>
        <TabsTrigger value="aio" className="text-aio">Análise AIO</TabsTrigger>
        <TabsTrigger value="combined">Recomendações</TabsTrigger>
      </TabsList>
      
      <TabsContent value="seo" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-seo" /> Tempo de Carregamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1 items-center">
                <span className="text-sm">Desktop</span>
                <span className={`text-sm font-medium ${seoData.loadTimeDesktop < 2 ? 'text-green-600' : seoData.loadTimeDesktop < 3 ? 'text-amber-600' : 'text-red-600'}`}>
                  {seoData.loadTimeDesktop}s
                </span>
              </div>
              <Progress value={100 - (seoData.loadTimeDesktop * 20)} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1 items-center">
                <span className="text-sm">Mobile</span>
                <span className={`text-sm font-medium ${seoData.loadTimeMobile < 3 ? 'text-green-600' : seoData.loadTimeMobile < 5 ? 'text-amber-600' : 'text-red-600'}`}>
                  {seoData.loadTimeMobile}s
                </span>
              </div>
              <Progress value={100 - (seoData.loadTimeMobile * 10)} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Smartphone className="h-4 w-4 text-seo" /> Mobile-friendly
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-4">
                {seoData.mobileFriendly ? (
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                ) : (
                  <XCircle className="h-16 w-16 text-red-500" />
                )}
              </div>
              <p className="text-center text-sm mt-2">
                {seoData.mobileFriendly 
                  ? "O seu site é otimizado para dispositivos móveis"
                  : "O seu site precisa de melhorias para dispositivos móveis"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4 text-seo" /> Segurança
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-4">
                {seoData.security ? (
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                ) : (
                  <XCircle className="h-16 w-16 text-red-500" />
                )}
              </div>
              <p className="text-center text-sm mt-2">
                {seoData.security 
                  ? "HTTPS implementado corretamente"
                  : "É necessário implementar HTTPS no seu site"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Image className="h-4 w-4 text-seo" /> Otimização de Imagens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="w-24 h-24 relative flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke="#e2e8f0"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke={seoData.imageOptimization > 70 ? '#22c55e' : seoData.imageOptimization > 40 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="8"
                      strokeDasharray={`${seoData.imageOptimization * 2.83} ${283 - seoData.imageOptimization * 2.83}`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <span className="absolute text-xl font-semibold">{seoData.imageOptimization}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-seo" /> Estrutura de Headings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="w-24 h-24 relative flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke="#e2e8f0"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke={seoData.headingsStructure > 70 ? '#22c55e' : seoData.headingsStructure > 40 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="8"
                      strokeDasharray={`${seoData.headingsStructure * 2.83} ${283 - seoData.headingsStructure * 2.83}`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <span className="absolute text-xl font-semibold">{seoData.headingsStructure}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-seo" /> Meta Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="w-24 h-24 relative flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke="#e2e8f0"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke={seoData.metaTags > 70 ? '#22c55e' : seoData.metaTags > 40 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="8"
                      strokeDasharray={`${seoData.metaTags * 2.83} ${283 - seoData.metaTags * 2.83}`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <span className="absolute text-xl font-semibold">{seoData.metaTags}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" /> Problemas Identificados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {seoData.issues.map((issue, index) => (
              <div key={index} className="border-l-4 pl-4 py-2" 
                style={{ 
                  borderColor: issue.severity === 'high' 
                    ? '#ef4444' 
                    : issue.severity === 'medium' 
                      ? '#f59e0b' 
                      : '#22c55e'
                }}>
                <h4 className="font-medium">{issue.title}</h4>
                <p className="text-sm text-gray-600">{issue.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="aio" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Clareza do Conteúdo</CardTitle>
              <CardDescription>Facilidade de compreensão</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div className="w-24 h-24 relative flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke="#e2e8f0"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke={aioData.contentClarity > 70 ? '#8B5CF6' : aioData.contentClarity > 40 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="8"
                      strokeDasharray={`${aioData.contentClarity * 2.83} ${283 - aioData.contentClarity * 2.83}`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <span className="absolute text-xl font-semibold">{aioData.contentClarity}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Estrutura Lógica</CardTitle>
              <CardDescription>Usabilidade para IA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div className="w-24 h-24 relative flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke="#e2e8f0"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke={aioData.logicalStructure > 70 ? '#8B5CF6' : aioData.logicalStructure > 40 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="8"
                      strokeDasharray={`${aioData.logicalStructure * 2.83} ${283 - aioData.logicalStructure * 2.83}`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <span className="absolute text-xl font-semibold">{aioData.logicalStructure}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Linguagem Natural</CardTitle>
              <CardDescription>Objetividade e factualidade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div className="w-24 h-24 relative flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke="#e2e8f0"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke={aioData.naturalLanguage > 70 ? '#8B5CF6' : aioData.naturalLanguage > 40 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="8"
                      strokeDasharray={`${aioData.naturalLanguage * 2.83} ${283 - aioData.naturalLanguage * 2.83}`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <span className="absolute text-xl font-semibold">{aioData.naturalLanguage}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tópicos Detectados</CardTitle>
            <CardDescription>Como os modelos de IA classificam seu conteúdo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {aioData.topicsDetected.map((topic, index) => (
                <span key={index} className="bg-aio/10 text-aio px-3 py-1 rounded-full text-sm">
                  {topic}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Partes Confusas para IA</CardTitle>
            <CardDescription>Elementos que podem dificultar a compreensão</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside">
              {aioData.confusingParts.map((part, index) => (
                <li key={index} className="text-sm text-gray-700">{part}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="combined" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Recomendações de Melhoria</CardTitle>
            <CardDescription>Ações prioritárias para melhorar seu site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Sugestão</th>
                    <th className="text-center py-3 px-2">Impacto SEO</th>
                    <th className="text-center py-3 px-2">Impacto AIO</th>
                    <th className="text-center py-3 px-2">Prioridade</th>
                  </tr>
                </thead>
                <tbody>
                  {recommendations
                    .sort((a, b) => b.priority - a.priority)
                    .map((rec, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2 text-sm">{rec.suggestion}</td>
                      <td className="py-3 px-2 text-center">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium
                          ${rec.seoImpact === 'Alto' 
                            ? 'bg-seo/10 text-seo' 
                            : rec.seoImpact === 'Médio'
                              ? 'bg-amber-100 text-amber-800'
                              : rec.seoImpact === 'Baixo'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-gray-50 text-gray-500'
                          }
                        `}>
                          {rec.seoImpact}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium
                          ${rec.aioImpact === 'Alto' 
                            ? 'bg-aio/10 text-aio' 
                            : rec.aioImpact === 'Médio'
                              ? 'bg-amber-100 text-amber-800'
                              : rec.aioImpact === 'Baixo'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-gray-50 text-gray-500'
                          }
                        `}>
                          {rec.aioImpact}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex justify-center">
                          <div className="h-2 w-full max-w-24 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${rec.priority >= 9 ? 'bg-red-500' : rec.priority >= 7 ? 'bg-amber-500' : 'bg-green-500'}`}
                              style={{ width: `${rec.priority * 10}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AnalysisTabs;
