
// Define interface for contact form request
export interface ContactRequest {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

// Define interface for confirmation email request
export interface ConfirmationEmailRequest {
  type: 'confirmation';
  email: string;
  name: string;
  confirmationUrl: string;
}

// Define interface for report email request
export interface ReportEmailRequest {
  type: 'report';
  email: string;
  name: string;
  reportUrl: string;
  seoScore: number;
  aioScore: number;
  websiteUrl: string;
}

// Type union for all email request types
export type EmailRequest = ContactRequest | ConfirmationEmailRequest | ReportEmailRequest;
