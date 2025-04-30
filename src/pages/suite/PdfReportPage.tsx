
import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useReportData } from '@/hooks/useReportData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink, FileText, BarChart3, BrainCircuit, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import components for rendering the different sections
import CoreWebVitalsPanel from '@/components/seo/CoreWebVitalsPanel';
import TechnicalAuditsPanel from '@/components/seo/TechnicalAuditsPanel';
import OpportunitiesPanel from '@/components/seo/OpportunitiesPanel';
import DevicePerformancePanel from '@/components/seo/DevicePerformancePanel';
import AioAnalysisPanel from '@/components/AioAnalysisPanel';

// Helper utility to extract domain
const extractDomain = (url: string) => {
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
  } catch (e) {
    return url;
  }
};

// Helper to process PageSpeed data similar to DeviceTabsSection
const processPageSpeedData = (rawData: any) => {
  if (!rawData) {
    console.warn('Missing PageSpeed data');
    return null;
  }
  
  try {
    // Extract the lighthouse result from PageSpeed's API response structure
    const lighthouse = rawData.lighthouseResult;
    
    if (!lighthouse) {
      console.warn('Missing lighthouse result in PageSpeed data', rawData);
      return null;
    }
    
    const audits = lighthouse.audits || {};
    
    // Extract performance metrics
    const fcp = audits['first-contentful-paint']?.numericValue / 1000 || 0;
    const lcp = audits['largest-contentful-paint']?.numericValue / 1000 || 0;
    const tbt = audits['total-blocking-time']?.numericValue || 0;
    const cls = audits['cumulative-layout-shift']?.numericValue || 0;
    const fid = audits['max-potential-fid']?.numericValue || 0;
    const speedIndex = audits['speed-index']?.numericValue / 1000 || 0;
    const tti = audits['interactive']?.numericValue / 1000 || 0;
    const performanceScore = lighthouse.categories?.performance?.score * 100 || 0;
    
    // Extract SEO audits
    const mobileFriendly = audits['viewport']?.score === 1;
    const https = audits['is-on-https']?.score === 1;
    const mixedContent = audits['is-on-https']?.score !== 1;
    
    // Extract headings and meta tags
    const hasH1 = audits['heading-order']?.score === 1;
    const multipleH1 = audits['heading-order']?.score !== 1;
    const headingsOrder = audits['heading-order']?.score === 1;
    
    const metaTags = {
      title: audits['document-title']?.displayValue || '',
      description: audits['meta-description']?.displayValue || '',
      titleLength: audits['document-title']?.displayValue?.length || 0,
      descriptionLength: audits['meta-description']?.displayValue?.length || 0
    };
    
    // Extract recommendations
    const recommendations = [];
    
    // Add opportunities as recommendations
    const opportunityAudits = Object.values(audits).filter((audit: any) => 
      audit.details?.type === 'opportunity' && audit.score !== null && audit.score < 1
    );
    
    opportunityAudits.forEach((audit: any, index) => {
      recommendations.push({
        id: audit.id || `opp-${index}`,
        title: audit.title || '',
        description: audit.description || '',
        impact: audit.score < 0.5 ? 'high' : audit.score < 0.9 ? 'medium' : 'low',
        category: 'performance'
      });
    });
    
    return {
      performanceScore,
      fcp,
      lcp,
      tbt,
      cls,
      speedIndex,
      tti,
      fid,
      mobileFriendly,
      security: {
        https,
        mixedContent
      },
      headingsStructure: {
        hasH1,
        multipleH1,
        headingsOrder
      },
      metaTags,
      recommendations
    };
  } catch (err) {
    console.error('Error processing PageSpeed data:', err);
    return null;
  }
};

// Main component
const PdfReportPage: React.FC = () => {
  const navigate = useNavigate();
  // Get task IDs from URL query parameters
  const [searchParams] = useSearchParams();
  const desktopTaskId = searchParams.get('desktopTaskId') || '';
  const mobileTaskId = searchParams.get('mobileTaskId') || '';
  const aiOptimizationTaskId = searchParams.get('aiOptimizationTaskId') || '';
  
  // Fetch data using the hook
  const { data, isLoading, error } = useReportData(
    desktopTaskId,
    mobileTaskId,
    aiOptimizationTaskId
  );
  
  // Process data for rendering when available
  const processedDesktopData = useMemo(() => {
    if (!data?.desktop?.data) return null;
    return processPageSpeedData(data.desktop.data);
  }, [data?.desktop?.data]);
  
  const processedMobileData = useMemo(() => {
    if (!data?.mobile?.data) return null;
    return processPageSpeedData(data.mobile.data);
  }, [data?.mobile?.data]);
  
  // Extract AI optimization data
  const aiData = useMemo(() => {
    if (!data?.aiOptimization?.data) return null;
    try {
      const aiData = data.aiOptimization.data;
      
      // Map the AI data from the format we received to the format expected by AioAnalysisPanel
      return {
        // Map scores.overall to score
        score: aiData.scores?.overall || 0,
        // Map scores.human_readability to contentClarity 
        contentClarity: aiData.scores?.human_readability || 0,
        // Map scores.llm_interpretability to naturalLanguage
        naturalLanguage: aiData.scores?.llm_interpretability || 0,
        // Derive logicalStructure as an average if not explicitly provided
        logicalStructure: aiData.scores?.logical_structure || 
          Math.round((aiData.scores?.overall + aiData.scores?.human_readability) / 2) || 0,
        // Extract topics from strengths (or empty array)
        topicsDetected: aiData.strengths?.map((item: any) => item.title) || [],
        // Extract confusing parts from weaknesses (or empty array)
        confusingParts: aiData.weaknesses?.map((item: any) => item.explanation) || []
      };
    } catch (err) {
      console.error('Error processing AI optimization data:', err);
      return null;
    }
  }, [data?.aiOptimization?.data]);
  
  // Determine domain for title
  const domain = useMemo(() => {
    return data?.siteUrl ? extractDomain(data.siteUrl) : 'Unknown Site';
  }, [data?.siteUrl]);
  
  // Handle back button click
  const handleBackClick = () => {
    navigate('/suite/reports');
  };
  
  // Main content - completely standalone layout without SuiteLayout wrapper
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple header with back button */}
      <header className="bg-white border-b p-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackClick}
              className="mr-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Reports
            </Button>
            
            <div>
              <h1 className="text-xl font-semibold">Technical SEO Report</h1>
              {domain && <p className="text-sm text-gray-500">{domain}</p>}
              {data && <p className="text-xs text-gray-400">Generated on {new Date().toLocaleDateString()}</p>}
            </div>
          </div>
          
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-primary mr-2" />
            <span className="font-medium">PDF Report</span>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="container mx-auto py-6">
        {isLoading ? (
          <div className="min-h-[60vh] bg-gray-50 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <h2 className="text-xl font-medium mb-2">Generating Report</h2>
            <p className="text-muted-foreground">
              Loading analysis data for PDF generation...
            </p>
          </div>
        ) : error ? (
          <div className="min-h-[60vh] bg-gray-50">
            <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Error Loading Report
              </h2>
              <p className="mb-4">{error}</p>
              <p className="text-sm text-muted-foreground">
                Make sure all three task IDs are correctly provided in the URL and that all tasks have completed successfully.
              </p>
              <pre className="mt-4 p-3 bg-white border rounded-md overflow-auto text-xs">
                <code className="text-muted-foreground">
                  {`desktopTaskId: ${desktopTaskId}\nmobileTaskId: ${mobileTaskId}\naiOptimizationTaskId: ${aiOptimizationTaskId}`}
                </code>
              </pre>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Report Header */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex flex-col md:flex-row items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{domain}</h1>
                  <p className="text-muted-foreground">
                    Technical SEO & AI Content Analysis Report
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Generated on {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-10 w-10 text-primary" />
                  <span className="text-lg font-semibold">PDF Report</span>
                </div>
              </div>
              
              {data?.siteUrl && (
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span className="font-medium">Analyzed URL:</span>
                  <a 
                    href={data.siteUrl.startsWith('http') ? data.siteUrl : `https://${data.siteUrl}`}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data.siteUrl}
                  </a>
                </div>
              )}
            </div>
            
            {/* Desktop Analysis Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-bold">Desktop SEO Analysis</h2>
              </div>
              
              {processedDesktopData ? (
                <div className="space-y-6">
                  <DevicePerformancePanel 
                    data={processedDesktopData}
                    deviceType="desktop"
                  />
                  
                  <CoreWebVitalsPanel 
                    lcp={processedDesktopData.lcp || 0}
                    cls={processedDesktopData.cls || 0}
                    fid={processedDesktopData.fid || 0}
                  />
                  
                  <TechnicalAuditsPanel 
                    data={{
                      mobileFriendly: processedDesktopData.mobileFriendly || false,
                      security: processedDesktopData.security || {
                        https: false,
                        mixedContent: false
                      },
                      headingsStructure: processedDesktopData.headingsStructure || {
                        hasH1: false,
                        multipleH1: false,
                        headingsOrder: false
                      },
                      metaTags: processedDesktopData.metaTags || {
                        title: '',
                        description: '',
                        titleLength: 0,
                        descriptionLength: 0
                      }
                    }}
                  />
                  
                  <OpportunitiesPanel 
                    opportunities={processedDesktopData.recommendations || []}
                  />
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No desktop analysis data available</p>
                </Card>
              )}
            </section>
            
            {/* Mobile Analysis Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-green-500" />
                <h2 className="text-xl font-bold">Mobile SEO Analysis</h2>
              </div>
              
              {processedMobileData ? (
                <div className="space-y-6">
                  <DevicePerformancePanel 
                    data={processedMobileData}
                    deviceType="mobile"
                  />
                  
                  <CoreWebVitalsPanel 
                    lcp={processedMobileData.lcp || 0}
                    cls={processedMobileData.cls || 0}
                    fid={processedMobileData.fid || 0}
                  />
                  
                  <TechnicalAuditsPanel 
                    data={{
                      mobileFriendly: processedMobileData.mobileFriendly || false,
                      security: processedMobileData.security || {
                        https: false,
                        mixedContent: false
                      },
                      headingsStructure: processedMobileData.headingsStructure || {
                        hasH1: false,
                        multipleH1: false,
                        headingsOrder: false
                      },
                      metaTags: processedMobileData.metaTags || {
                        title: '',
                        description: '',
                        titleLength: 0,
                        descriptionLength: 0
                      }
                    }}
                  />
                  
                  <OpportunitiesPanel 
                    opportunities={processedMobileData.recommendations || []}
                  />
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No mobile analysis data available</p>
                </Card>
              )}
            </section>
            
            {/* AI Optimization Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <BrainCircuit className="h-5 w-5 text-purple-500" />
                <h2 className="text-xl font-bold">AI Content Optimization</h2>
              </div>
              
              {aiData ? (
                <div className="space-y-6">
                  <AioAnalysisPanel
                    aioScore={aiData.score}
                    contentClarity={aiData.contentClarity}
                    logicalStructure={aiData.logicalStructure}
                    naturalLanguage={aiData.naturalLanguage}
                    topicsDetected={aiData.topicsDetected}
                    confusingParts={aiData.confusingParts}
                  />
                  
                  {/* Optional: Add more AI-specific panels here if needed */}
                  {data?.aiOptimization?.data?.recommendations && (
                    <Card className="p-6">
                      <h3 className="text-lg font-medium mb-4">AI Recommendations</h3>
                      <div className="space-y-3">
                        {data.aiOptimization.data.recommendations.map((rec: any, idx: number) => (
                          <div key={idx} className="p-3 border rounded-md bg-purple-50">
                            <h4 className="font-medium">{rec.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{rec.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No AI optimization data available</p>
                </Card>
              )}
            </section>
            
            {/* Footer */}
            <footer className="text-center text-sm text-muted-foreground pt-6 border-t border-gray-200 mt-12">
              <p>© {new Date().getFullYear()} SEO Technical Audit Platform</p>
              <p className="mt-1">This report was generated automatically and should be reviewed by a professional SEO specialist</p>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfReportPage;
