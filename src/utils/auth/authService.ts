
import { createDefaultUsers } from './createDefaultUsers';
import { signUpWithEmail } from './signupService';
import { signInWithEmail } from './signinService';
import { resetPassword, updatePassword } from './passwordService';
import { checkUserRole, ensureUserInDb, ensureAdminUserInDb } from './userProfileService';

// Re-export all the functions
export { 
  createDefaultUsers,
  signUpWithEmail,
  signInWithEmail,
  resetPassword,
  updatePassword,
  checkUserRole,
  ensureUserInDb,
  ensureAdminUserInDb
};

// Re-export types
export type { SignUpData } from './types';
export type { UserRole } from './types';
