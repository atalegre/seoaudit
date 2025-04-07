
import { createDefaultUsers } from './createDefaultUsers';
import { createOrUpdateAdmin, isAdminEmail, handleAdminUser } from './adminUserService';
import { createOrUpdateClient } from './clientUserService';
import { signUpWithEmail, checkEmailExists } from './signupService';
import { signInWithEmail } from './signinService';
import { resetPassword, updatePassword } from './passwordService';
import { checkUserRole, getUserProfile, createUserProfile } from './profileService';

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
  getUserProfile,
  createUserProfile,
  checkEmailExists,
  isAdminEmail,
  handleAdminUser
};

// Re-export types
export type { SignUpData, UserRole, UserProfile } from './types';
