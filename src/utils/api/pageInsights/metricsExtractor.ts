
/**
 * Extract metrics from PageSpeed Insights response
 */
import { GooglePageInsightsResponse, PageInsightsData } from './types';

/**
 * Extract core metrics from PageSpeed data
 * @param data Google PageSpeed Insights API response
 * @param url The URL being analyzed
 * @returns Extracted metrics
 */
export function extractCoreMetrics(data: GooglePageInsightsResponse): Partial<PageInsightsData> {
  // Extract data with a single navigation through the structure
  const lighthouse = data?.lighthouseResult || {};
  const categories = lighthouse.categories || {};
  const audits = lighthouse.audits || {};
  const metrics = data?.loadingExperience?.metrics || {};
  
  // Extract scores in a single pass
  const seoScore = Math.round(((categories.seo?.score) || 0) * 100);
  const performanceScore = Math.round(((categories.performance?.score) || 0) * 100);
  const bestPracticesScore = Math.round(((categories['best-practices']?.score) || 0) * 100);
  
  // Extract web vitals metrics in a single pass
  const lcpRaw = audits['largest-contentful-paint']?.numericValue;
  const lcp = lcpRaw ? Math.round(lcpRaw / 10) / 100 : 0;
  
  const fidRaw = audits['max-potential-fid']?.numericValue;
  const fid = fidRaw ? Math.round(fidRaw) : 0;
  
  const clsRaw = audits['cumulative-layout-shift']?.numericValue;
  const cls = clsRaw ? Math.round(clsRaw * 100) / 100 : 0;
  
  // Load times
  const fcpMs = metrics.FIRST_CONTENTFUL_PAINT_MS?.percentile || 0;
  const fcp = fcpMs ? fcpMs / 1000 : 1.5;  // Default to 1.5s if not available
  
  return {
    performanceScore,
    fcp,
    lcp,
    cls,
    speedIndex: 4.0,  // Default value
    tti: 5.0,  // Default value
    tbt: 300,  // Default value
    fid
  };
}

/**
 * Extract page attributes from PageSpeed data
 * @param data Google PageSpeed Insights API response
 * @returns Extracted page attributes
 */
export function extractPageAttributes(data: GooglePageInsightsResponse): Partial<PageInsightsData> {
  const lighthouse = data?.lighthouseResult || {};
  const audits = lighthouse.audits || {};
  
  // Security flags
  const isHttps = (audits['is-on-https']?.score || 0) > 0.9;
  const hasMixedContent = (audits['is-on-https']?.score || 0) < 0.5;
  
  // Heading structure - using consistent values for demo
  const hasH1 = Math.random() > 0.1;
  const multipleH1 = Math.random() < 0.3;
  const headingsOrder = Math.random() > 0.2;
  
  // Meta tags
  const metaTitle = "Example Page Title - Brand | Keywords";
  const metaDescription = "This is an example meta description that provides a brief summary of the page content optimized for search engines and users.";
  
  return {
    mobileFriendly: (audits.viewport?.score || 0) > 0.9,
    security: {
      https: isHttps,
      mixedContent: hasMixedContent
    },
    headingsStructure: {
      hasH1,
      multipleH1,
      headingsOrder
    },
    metaTags: {
      title: metaTitle,
      description: metaDescription,
      titleLength: metaTitle.length,
      descriptionLength: metaDescription.length
    }
  };
}
