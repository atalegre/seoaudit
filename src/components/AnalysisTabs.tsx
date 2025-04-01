import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Clock, 
  Smartphone, 
  Image, 
  FileText, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Zap,
  Layout,
  Loader2,
  MessageSquare
} from 'lucide-react';
import { SeoAnalysisResult, AioAnalysisResult } from '@/utils/api/types';
import LLMPresenceAudit from './LLMPresenceAudit';

interface AnalysisTabsProps {
  seoData: SeoAnalysisResult;
  aioData: AioAnalysisResult;
  url?: string;
  recommendations?: Array<{
    suggestion: string;
    seoImpact: 'Alto' | 'Médio' | 'Baixo' | 'Nenhum';
    aioImpact: 'Alto' | 'Médio' | 'Baixo' | 'Nenhum';
    priority: number;
    status?: 'pending' | 'in_progress' | 'done' | 'ignored';
  }>;
}

const AnalysisTabs: React.FC<AnalysisTabsProps> = ({ 
  seoData, 
  aioData,
  url = "",
  recommendations = []
}) => {
  return (
    <Tabs defaultValue="seo" className="w-full animate-fade-in" style={{ animationDelay: '300ms' }}>
      <TabsList className="grid grid-cols-5 mb-6">
        <TabsTrigger value="seo" className="text-seo">Análise SEO</TabsTrigger>
        <TabsTrigger value="coreweb" className="text-seo">Core Web Vitals</TabsTrigger>
        <TabsTrigger value="aio" className="text-aio">Análise AIO</TabsTrigger>
        <TabsTrigger value="llm" className="text-aio">LLM Presence</TabsTrigger>
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
                <span className={`text-sm font-medium ${seoData?.loadTimeDesktop < 2 ? 'text-green-600' : seoData?.loadTimeDesktop < 3 ? 'text-amber-600' : 'text-red-600'}`}>
                  {seoData?.loadTimeDesktop || 0}s
                </span>
              </div>
              <Progress value={100 - ((seoData?.loadTimeDesktop || 0) * 20)} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1 items-center">
                <span className="text-sm">Mobile</span>
                <span className={`text-sm font-medium ${seoData?.loadTimeMobile < 3 ? 'text-green-600' : seoData?.loadTimeMobile < 5 ? 'text-amber-600' : 'text-red-600'}`}>
                  {seoData?.loadTimeMobile || 0}s
                </span>
              </div>
              <Progress value={100 - ((seoData?.loadTimeMobile || 0) * 10)} className="h-2" />
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
                {seoData?.mobileFriendly ? (
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                ) : (
                  <XCircle className="h-16 w-16 text-red-500" />
                )}
              </div>
              <p className="text-center text-sm mt-2">
                {seoData?.mobileFriendly 
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
                {seoData?.security ? (
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                ) : (
                  <XCircle className="h-16 w-16 text-red-500" />
                )}
              </div>
              <p className="text-center text-sm mt-2">
                {seoData?.security 
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
                      stroke={(seoData?.imageOptimization || 0) > 70 ? '#22c55e' : (seoData?.imageOptimization || 0) > 40 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="8"
                      strokeDasharray={`${(seoData?.imageOptimization || 0) * 2.83} ${283 - (seoData?.imageOptimization || 0) * 2.83}`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <span className="absolute text-xl font-semibold">{seoData?.imageOptimization || 0}%</span>
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
                      stroke={(seoData?.headingsStructure || 0) > 70 ? '#22c55e' : (seoData?.headingsStructure || 0) > 40 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="8"
                      strokeDasharray={`${(seoData?.headingsStructure || 0) * 2.83} ${283 - (seoData?.headingsStructure || 0) * 2.83}`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <span className="absolute text-xl font-semibold">{seoData?.headingsStructure || 0}%</span>
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
                      stroke={(seoData?.metaTags || 0) > 70 ? '#22c55e' : (seoData?.metaTags || 0) > 40 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="8"
                      strokeDasharray={`${(seoData?.metaTags || 0) * 2.83} ${283 - (seoData?.metaTags || 0) * 2.83}`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <span className="absolute text-xl font-semibold">{seoData?.metaTags || 0}%</span>
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
            {seoData?.issues && seoData.issues.length > 0 ? (
              seoData.issues.map((issue, index) => (
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
              ))
            ) : (
              <p className="text-center text-muted-foreground">Nenhum problema identificado.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="coreweb" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-seo" /> Core Web Vitals
            </CardTitle>
            <CardDescription>
              Métricas essenciais para a experiência do usuário medidas pelo Google
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {seoData?.performanceScore !== undefined ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex justify-center mb-2">
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
                          stroke={(seoData?.performanceScore || 0) > 89 ? '#22c55e' : (seoData?.performanceScore || 0) > 49 ? '#f59e0b' : '#ef4444'}
                          strokeWidth="8"
                          strokeDasharray={`${(seoData?.performanceScore || 0) * 2.83} ${283 - (seoData?.performanceScore || 0) * 2.83}`}
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <span className="absolute text-xl font-semibold">{seoData?.performanceScore || 0}</span>
                    </div>
                  </div>
                  <h3 className="text-center font-medium mt-2">Performance</h3>
                  <p className="text-xs text-center text-muted-foreground mt-1">Velocidade e responsividade</p>
                </div>

                <div className="flex flex-col items-center">
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
                        stroke={(seoData?.bestPracticesScore || 0) > 89 ? '#22c55e' : (seoData?.bestPracticesScore || 0) > 49 ? '#f59e0b' : '#ef4444'}
                        strokeWidth="8"
                        strokeDasharray={`${(seoData?.bestPracticesScore || 0) * 2.83} ${283 - (seoData?.bestPracticesScore || 0) * 2.83}`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <span className="absolute text-xl font-semibold">{seoData?.bestPracticesScore || 0}</span>
                  </div>
                  <h3 className="text-center font-medium mt-2">Boas Práticas</h3>
                  <p className="text-xs text-center text-muted-foreground mt-1">Conformidade com padrões web</p>
                </div>

                <div className="flex flex-col items-center">
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
                        stroke={(seoData?.score || 0) > 89 ? '#22c55e' : (seoData?.score || 0) > 49 ? '#f59e0b' : '#ef4444'}
                        strokeWidth="8"
                        strokeDasharray={`${(seoData?.score || 0) * 2.83} ${283 - (seoData?.score || 0) * 2.83}`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <span className="absolute text-xl font-semibold">{seoData?.score || 0}</span>
                  </div>
                  <h3 className="text-center font-medium mt-2">SEO</h3>
                  <p className="text-xs text-center text-muted-foreground mt-1">Otimização para buscadores</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="text-muted-foreground">Dados não disponíveis</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-seo" /> Mobile Usability
            </CardTitle>
            <CardDescription>
              Avaliação da experiência do site em dispositivos móveis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {seoData?.mobileFriendly !== undefined ? (
                <>
                  <div className="flex items-center justify-center">
                    {seoData?.mobileFriendly ? (
                      <div className="flex flex-col items-center">
                        <CheckCircle2 className="h-16 w-16 text-green-500 mb-2" />
                        <p className="text-center font-medium">Site otimizado para dispositivos móveis</p>
                        <p className="text-sm text-muted-foreground text-center mt-1">
                          Seu site está adaptado para experiência em dispositivos móveis
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <XCircle className="h-16 w-16 text-red-500 mb-2" />
                        <p className="text-center font-medium">Problemas de usabilidade mobile</p>
                        <p className="text-sm text-muted-foreground text-center mt-1">
                          Seu site precisa de melhorias para dispositivos móveis
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Layout className="h-5 w-5 text-seo" />
                        <h3 className="font-medium">Viewport</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {seoData?.mobileFriendly 
                          ? "A viewport está configurada corretamente para dispositivos móveis."
                          : "Configuração de viewport ausente ou incorreta."}
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Smartphone className="h-5 w-5 text-seo" />
                        <h3 className="font-medium">Tamanho dos elementos clicáveis</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {seoData?.mobileFriendly 
                          ? "Os elementos interativos têm o tamanho adequado para toque em dispositivos móveis."
                          : "Alguns elementos clicáveis podem ser muito pequenos para interfaces touch."}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">Dados não disponíveis</p>
                  </div>
                </div>
              )}
            </div>
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
                      stroke={(aioData?.contentClarity || 0) > 70 ? '#8B5CF6' : (aioData?.contentClarity || 0) > 40 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="8"
                      strokeDasharray={`${(aioData?.contentClarity || 0) * 2.83} ${283 - (aioData?.contentClarity || 0) * 2.83}`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <span className="absolute text-xl font-semibold">{aioData?.contentClarity || 0}%</span>
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
                      stroke={(aioData?.logicalStructure || 0) > 70 ? '#8B5CF6' : (aioData?.logicalStructure || 0) > 40 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="8"
                      strokeDasharray={`${(aioData?.logicalStructure || 0) * 2.83} ${283 - (aioData?.logicalStructure || 0) * 2.83}`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <span className="absolute text-xl font-semibold">{aioData?.logicalStructure || 0}%</span>
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
                      stroke={(aioData?.naturalLanguage || 0) > 70 ? '#8B5CF6' : (aioData?.naturalLanguage || 0) > 40 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="8"
                      strokeDasharray={`${(aioData?.naturalLanguage || 0) * 2.83} ${283 - (aioData?.naturalLanguage || 0) * 2.83}`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <span className="absolute text-xl font-semibold">{aioData?.naturalLanguage || 0}%</span>
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
            {aioData?.topicsDetected && aioData.topicsDetected.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {aioData.topicsDetected.map((topic, index) => (
                  <span key={index} className="bg-aio/10 text-aio px-3 py-1 rounded-full text-sm">
                    {topic}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">Nenhum tópico detectado.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Partes Confusas para IA</CardTitle>
            <CardDescription>Elementos que podem dificultar a compreensão</CardDescription>
          </CardHeader>
          <CardContent>
            {aioData?.confusingParts && aioData.confusingParts.length > 0 ? (
              <ul className="space-y-2 list-disc list-inside">
                {aioData.confusingParts.map((part, index) => (
                  <li key={index} className="text-sm text-gray-700">{part}</li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-muted-foreground">Nenhuma parte confusa identificada.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="llm" className="space-y-4">
        <LLMPresenceAudit url={url} autoStart={true} />
      </TabsContent>

      <TabsContent value="combined" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Recomendações de Melhoria</CardTitle>
            <CardDescription>Ações prioritárias para melhorar seu site</CardDescription>
          </CardHeader>
          <CardContent>
            {recommendations && recommendations.length > 0 ? (
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
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>Ainda não há recomendações disponíveis.</p>
                <p className="mt-2">Gere um novo relatório para receber recomendações de melhoria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AnalysisTabs;
