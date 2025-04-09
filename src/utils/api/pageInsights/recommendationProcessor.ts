
/**
 * Process and extract recommendations from PageSpeed Insights results
 */
import { getAuditImportance, mapImportanceToImpact, getAuditCategory } from './auditImportance';

/**
 * Extract and process critical audit recommendations
 * @param audits Audit results from PageSpeed Insights
 * @returns Formatted recommendations array
 */
export function processRecommendations(audits: Record<string, any>) {
  // Critical audits to check
  const criticalAudits = [
    'render-blocking-resources', 
    'unused-javascript', 
    'uses-responsive-images',
    'offscreen-images',
    'properly-sized-images',
    'unminified-css',
    'unminified-javascript',
    'first-contentful-paint',
    'largest-contentful-paint'
  ];
  
  // Filter and map the recommendations
  return criticalAudits
    .filter(id => audits[id] && audits[id].score < 0.9)
    .map(id => {
      const importance = getAuditImportance(id);
      return {
        id,
        title: audits[id].title || '',
        description: audits[id].description || '',
        impact: mapImportanceToImpact(importance),
        category: getAuditCategory(id)
      };
    })
    .slice(0, 5); // Limit to 5 recommendations
}
