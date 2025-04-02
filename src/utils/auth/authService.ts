
import { supabase } from '@/integrations/supabase/client';

export type SignUpData = {
  name: string;
  email: string;
  password: string;
  acceptTerms: boolean;
};

export async function signUpWithEmail(data: SignUpData) {
  const { name, email, password } = data;

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    throw error;
  }
  
  // Store email for verification
  localStorage.setItem('pendingVerificationEmail', email);

  return authData;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    throw error;
  }
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    throw error;
  }
}

export async function verifyOTP(email: string, token: string) {
  // Use the verifyOTP method to verify the email with the provided token
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email'
  });

  if (error) {
    throw error;
  }
}
