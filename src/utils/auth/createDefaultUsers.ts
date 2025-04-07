
import { createOrUpdateAdmin } from './adminUserService';
import { createOrUpdateClient } from './clientUserService';

// Function to create default admin and client users if they don't exist
export async function createDefaultUsers() {
  try {
    console.log("Setting up default users...");
    
    // Try to create admin user (this will only create if it doesn't exist)
    await createOrUpdateAdmin();
    
    // Try to create client user (this will only create if it doesn't exist)
    await createOrUpdateClient();
    
    console.log('Default users setup complete');
  } catch (error) {
    console.error('Error in createDefaultUsers:', error);
  }
}

