
import { GooglePageInsightsResponse, PageInsightsData } from './types';
import { generateLocalPageInsights } from './mockDataGenerator';

/**
 * Process raw data from Google Page Insights API
 * @param data Google API response data
 * @param url The URL being analyzed
 * @returns Processed page insights data
 */
export function processPageInsightsData(data: GooglePageInsightsResponse, url: string): PageInsightsData {
  try {
    // Extract SEO score
    const seoScore = Math.round(data.lighthouseResult?.categories?.seo?.score * 100) || 70;
    
    // Extract performance information
    const performanceScore = Math.round(data.lighthouseResult?.categories?.performance?.score * 100) || 65;
    
    // Extract best practices information
    const bestPracticesScore = Math.round(data.lighthouseResult?.categories?.['best-practices']?.score * 100) || 75;
    
    // Extract Core Web Vitals
    const lcpValue = data.lighthouseResult?.audits?.['largest-contentful-paint']?.numericValue;
    const lcp = lcpValue ? Math.round(lcpValue / 10) / 100 : 3.5; // Convert to seconds and round
    
    const fidValue = data.lighthouseResult?.audits?.['max-potential-fid']?.numericValue;
    const fid = fidValue ? Math.round(fidValue) : 120; // Round to ms
    
    const clsValue = data.lighthouseResult?.audits?.['cumulative-layout-shift']?.numericValue;
    const cls = clsValue ? Math.round(clsValue * 100) / 100 : 0.15; // Round to two decimal places
    
    // Extract loading times
    const loadTimeDesktop = data.loadingExperience?.metrics?.FIRST_CONTENTFUL_PAINT_MS?.percentile / 1000 || 3.5;
    const loadTimeMobile = data.loadingExperience?.metrics?.FIRST_CONTENTFUL_PAINT_MS?.percentile / 1000 || 5.2;
    
    // Extract mobile usability information
    const mobileFriendly = data.lighthouseResult?.audits?.['viewport']?.score === 1;
    const tapTargetsAudit = data.lighthouseResult?.audits?.['tap-targets'];
    const tapTargetsScore = tapTargetsAudit?.score || 0;
    const tapTargetsDetails = tapTargetsAudit?.details?.items || [];
    
    // Extract audits for recommendations
    const audits = data.lighthouseResult?.audits || {};
    const auditItems = Object.keys(audits)
      .filter(key => !audits[key].score || audits[key].score < 0.9)
      .map(key => ({
        id: key,
        title: audits[key].title,
        description: audits[key].description,
        score: audits[key].score || 0,
        importance: getAuditImportance(key)
      }))
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 10);
    
    // Build data structure for the application
    return {
      score: seoScore,
      performanceScore: performanceScore,
      bestPracticesScore: bestPracticesScore,
      url: url,
      loadTimeDesktop: loadTimeDesktop,
      loadTimeMobile: loadTimeMobile,
      mobileFriendly: mobileFriendly,
      security: audits['is-on-https']?.score === 1,
      imageOptimization: Math.round((audits['uses-optimized-images']?.score || 0.6) * 100),
      headingsStructure: Math.round((audits['document-title']?.score || 0.7) * 100),
      metaTags: Math.round((audits['meta-description']?.score || 0.5) * 100),
      // Core Web Vitals
      lcp: lcp,
      fid: fid,
      cls: cls,
      // Mobile usability details
      tapTargetsScore: tapTargetsScore * 100,
      tapTargetsIssues: tapTargetsDetails.length,
      recommendations: auditItems.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        importance: item.importance
      }))
    };
  } catch (error) {
    console.error('Error processing Page Insights data:', error);
    // Generate local data in case of processing error
    return generateLocalPageInsights(url);
  }
}

/**
 * Determine the importance of each audit
 * @param auditId The audit ID from Google Page Insights
 * @returns Importance level (1-3)
 */
export function getAuditImportance(auditId: string): number {
  const highImportanceAudits = [
    'is-on-https', 
    'viewport', 
    'document-title', 
    'meta-description', 
    'link-text', 
    'crawlable-anchors',
    'largest-contentful-paint',
    'cumulative-layout-shift',
    'total-blocking-time'
  ];
  
  const mediumImportanceAudits = [
    'uses-optimized-images',
    'tap-targets',
    'structured-data',
    'hreflang',
    'plugins',
    'first-contentful-paint',
    'interactive'
  ];
  
  if (highImportanceAudits.includes(auditId)) return 3;
  if (mediumImportanceAudits.includes(auditId)) return 2;
  return 1;
}
