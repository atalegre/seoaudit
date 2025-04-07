
import { createDefaultUsers } from './createDefaultUsers';
import { createOrUpdateAdmin } from './adminUserService';
import { createOrUpdateClient } from './clientUserService';
import { signUpWithEmail } from './signupService';
import { signInWithEmail } from './signinService';
import { resetPassword, updatePassword } from './passwordService';
import { checkUserRole, ensureUserInDb, getUserProfile, checkEmailExists } from './userProfileService';
import { isAdminEmail, handleAdminUser } from './adminUserService';

// Re-export all the functions
export { 
  createDefaultUsers,
  createOrUpdateAdmin,
  createOrUpdateClient,
  signUpWithEmail,
  signInWithEmail,
  resetPassword,
  updatePassword,
  checkUserRole,
  ensureUserInDb,
  getUserProfile,
  checkEmailExists,
  isAdminEmail,
  handleAdminUser
};

// Re-export types
export type { SignUpData } from './types';
export type { UserRole } from './types';
