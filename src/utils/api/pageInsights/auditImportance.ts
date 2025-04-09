
/**
 * Utilities for determining audit importance and impact levels
 */

// Performance optimization: Pre-compute importance lookup table
export const auditImportanceMobile: Record<string, number> = {
  'render-blocking-resources': 3,
  'unused-javascript': 3,
  'uses-responsive-images': 3,
  'offscreen-images': 3,
  'total-byte-weight': 3,
  'largest-contentful-paint': 3,
  'max-potential-fid': 3,
  'cumulative-layout-shift': 3
};

/**
 * Map importance level to impact
 * @param importance Numeric importance level
 * @returns Impact level string
 */
export const mapImportanceToImpact = (importance: number): 'high' | 'medium' | 'low' => {
  if (importance >= 3) return 'high';
  if (importance >= 2) return 'medium';
  return 'low';
};

/**
 * Get audit category based on audit ID
 * @param id Audit ID from PageSpeed
 * @returns Category string
 */
export const getAuditCategory = (id: string): string => {
  if (id.includes('javascript') || id.includes('css') || id.includes('resource') || 
      id.includes('render') || id.includes('contentful-paint') || id.includes('speed')) {
    return 'performance';
  }
  if (id.includes('image') || id.includes('responsive')) {
    return 'performance';
  }
  if (id.includes('meta') || id.includes('description') || id.includes('title')) {
    return 'seo';
  }
  return 'best-practices';
};

/**
 * Determine the importance of each audit
 * @param auditId The ID of the Google Page Insights audit
 * @returns Importance level (1-3)
 */
export function getAuditImportance(auditId: string): number {
  return auditImportanceMobile[auditId] || 1;
}
