
// User roles
export type UserRole = 'admin' | 'editor' | 'user';

// Signup data interface
export interface SignUpData {
  name: string;
  email: string;
  password: string;
  acceptTerms?: boolean;
  role?: UserRole;
}

// User profile interface
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

// Supabase user interface with email
export interface SupabaseUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
  };
}

// Auth result interface
export interface AuthResult {
  user: any;
  session: any;
  isNewUser?: boolean;
  needsEmailVerification?: boolean;
  error?: any;
}
