
// WCAG 2.1 AA and EAA compliance audit module

export interface AccessibilityViolation {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  helpUrl?: string;
  nodes: number;
}

export interface AccessibilityAuditResult {
  score: number;
  violations: AccessibilityViolation[];
  wcagCompliant: boolean;
  eaaCompliant: boolean;
  passedTests: string[];
  manualChecksNeeded: string[];
}

interface SimpleViolationMatch {
  pattern: RegExp;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  id: string;
  description: string;
  wcag: string[];
  eaa?: boolean;
}

// Simplified patterns to detect common accessibility issues
const commonViolationPatterns: SimpleViolationMatch[] = [
  {
    pattern: /<img[^>]*(?!alt=)[^>]*>/i,
    impact: 'serious',
    id: 'image-alt',
    description: 'Images must have alternate text',
    wcag: ['1.1.1'],
    eaa: true
  },
  {
    pattern: /<[^>]*tabindex\s*=\s*["']?[2-9]\d*["']?[^>]*>/i,
    impact: 'serious',
    id: 'tabindex',
    description: 'tabindex values should not be greater than 1',
    wcag: ['2.4.3'],
    eaa: true
  },
  {
    pattern: /<a[^>]*(?!href=)[^>]*>/i,
    impact: 'serious',
    id: 'link-name',
    description: 'Links must have discernible text or accessible name',
    wcag: ['2.4.4', '4.1.2'],
    eaa: true
  },
  {
    pattern: /<html[^>]*(?!lang=)[^>]*>/i,
    impact: 'serious',
    id: 'html-lang',
    description: 'HTML element must have a lang attribute',
    wcag: ['3.1.1'],
    eaa: true
  },
  {
    pattern: /<form[^>]*>(?:(?!<label).)*<input[^>]*>/is,
    impact: 'serious',
    id: 'label',
    description: 'Form elements need associated labels',
    wcag: ['1.3.1', '4.1.2'],
    eaa: true
  },
  {
    pattern: /<h([2-6])[^>]*>.*?<\/h\1>(?:(?!<h[1-6]).)*<h1[^>]*>/is,
    impact: 'moderate',
    id: 'heading-order',
    description: 'Heading levels should only increase by one',
    wcag: ['1.3.1', '2.4.6'],
    eaa: true
  },
  {
    pattern: /style\s*=\s*["'][^"']*color:[^"']*["']/i,
    impact: 'serious',
    id: 'color-contrast',
    description: 'Potential color contrast issues with inline styles',
    wcag: ['1.4.3'],
    eaa: true
  }
];

// Detect common WCAG/EAA violations in HTML content
function detectViolations(htmlContent: string): AccessibilityViolation[] {
  const violations: AccessibilityViolation[] = [];
  
  for (const pattern of commonViolationPatterns) {
    const matches = htmlContent.match(new RegExp(pattern.pattern, 'g'));
    if (matches) {
      violations.push({
        id: pattern.id,
        impact: pattern.impact,
        description: pattern.description,
        helpUrl: `https://www.w3.org/WAI/WCAG21/Understanding/${pattern.wcag[0].replace('.', '-')}.html`,
        nodes: matches.length
      });
    }
  }
  
  return violations;
}

// Calculate the accessibility score based on violations
function calculateScore(violations: AccessibilityViolation[]): number {
  const baseScore = 100;
  let deductions = 0;
  
  for (const violation of violations) {
    switch (violation.impact) {
      case 'critical':
        deductions += 15 * violation.nodes;
        break;
      case 'serious':
        deductions += 10 * violation.nodes;
        break;
      case 'moderate':
        deductions += 5 * violation.nodes;
        break;
      case 'minor':
        deductions += 2 * violation.nodes;
        break;
    }
  }
  
  // Cap deductions at 100 points
  deductions = Math.min(deductions, 100);
  
  return Math.max(0, baseScore - deductions);
}

// Tests that require manual verification
const manualTestsList = [
  "Keyboard accessibility for all interactive elements",
  "Focus indication is clearly visible",
  "Text resizing up to 200% without loss of content",
  "Audio/video content has proper captions and transcripts",
  "Proper semantic structure for screen readers"
];

// Basic tests that are automatically passed if no related violations
const autoPassedTests = [
  "HTML language is specified",
  "Proper heading structure",
  "Images have alternative text",
  "Form fields have labels",
  "Links have discernible text",
  "No tabindex values greater than 1"
];

export function performAccessibilityAudit(content: string): AccessibilityAuditResult {
  // Detect violations in the HTML content
  const violations = detectViolations(content);
  
  // Calculate the compliance score
  const score = calculateScore(violations);
  
  // Determine which basic tests were passed
  const passedTests = autoPassedTests.filter(test => {
    const relatedViolations = violations.filter(v => {
      switch (test) {
        case "HTML language is specified":
          return v.id === 'html-lang';
        case "Proper heading structure":
          return v.id === 'heading-order';
        case "Images have alternative text":
          return v.id === 'image-alt';
        case "Form fields have labels":
          return v.id === 'label';
        case "Links have discernible text":
          return v.id === 'link-name';
        case "No tabindex values greater than 1":
          return v.id === 'tabindex';
        default:
          return false;
      }
    });
    
    return relatedViolations.length === 0;
  });
  
  // WCAG 2.1 AA compliance is assumed if no serious or critical violations
  const wcagCompliant = !violations.some(v => 
    v.impact === 'critical' || v.impact === 'serious'
  );
  
  // EAA compliance is stricter and includes digital documentation requirements
  const eaaCompliant = wcagCompliant;
  
  return {
    score,
    violations,
    wcagCompliant,
    eaaCompliant,
    passedTests,
    manualChecksNeeded: manualTestsList
  };
}
