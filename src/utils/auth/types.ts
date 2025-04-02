
export type SignUpData = {
  name: string;
  email: string;
  password: string;
  acceptTerms: boolean;
  role?: 'admin' | 'user';
};

export type UserRole = 'admin' | 'user';
