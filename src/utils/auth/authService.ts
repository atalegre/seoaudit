
import { createDefaultUsers } from './createDefaultUsers';
import { signUpWithEmail } from './signupService';
import { signInWithEmail } from './signinService';
import { resetPassword, updatePassword } from './passwordService';
import { checkUserRole, ensureUserInDb } from './userProfileService';

// Re-export all the functions
export { 
  createDefaultUsers,
  signUpWithEmail,
  signInWithEmail,
  resetPassword,
  updatePassword,
  checkUserRole,
  ensureUserInDb
};

// Re-export types
export type { SignUpData } from './types';
export type { UserRole } from './types';
