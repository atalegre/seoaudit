
import { User } from '@supabase/supabase-js';

export interface ReportFormProps {
  url: string;
  seoScore?: number;
  aioScore?: number;
  compact?: boolean;
}

export interface SubmissionFormProps extends ReportFormProps {
  sendByEmail: boolean;
  setSendByEmail: (value: boolean) => void;
  setIsSubmitted: (value: boolean) => void;
  user: User | null;
}

export interface SuccessViewProps {
  sendByEmail: boolean;
  compact: boolean;
  onDashboardClick: () => void;
}

export interface FormInputsProps {
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  compact: boolean;
}
