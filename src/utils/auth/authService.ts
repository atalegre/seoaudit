
import { supabase } from '@/integrations/supabase/client';
import { createUser } from '@/utils/api/userService';

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export const signUpWithEmail = async (values: SignUpData) => {
  const { data, error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: {
        name: values.name,
        role: 'user', // Default role for new users
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw error;
  }

  // Create a user record if signup was successful and we have a user ID
  if (data?.user) {
    try {
      await createUser({
        id: data.user.id,
        name: values.name,
        email: values.email,
        role: 'user'
      });
    } catch (usersError) {
      console.error("User record creation error:", usersError);
      // Don't block signup if this fails
    }
  }

  return data;
};
