
// This file now serves as the main entry point, re-exporting functionality from more specialized modules
import { checkUserRole } from './roleService';
import { getUserProfile, createUserProfile } from './profileService';
import { checkEmailExists } from './emailValidationService';
import { handleAdminUser, isAdminEmail } from './adminUserService';

// Re-export all functions
export {
  checkUserRole,
  getUserProfile,
  createUserProfile,
  checkEmailExists,
  handleAdminUser,
  isAdminEmail
};
