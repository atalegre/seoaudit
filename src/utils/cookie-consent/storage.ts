import { supabase } from '@/integrations/supabase/client';
import { CookieSettings } from './types';

// Local storage key
const COOKIE_CONSENT_KEY = 'cookie_consent_preferences';

/**
 * Save cookie preferences to localStorage
 */
export function saveToLocalStorage(preferences: CookieSettings): void {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving cookie consent to localStorage:', error);
  }
}

/**
 * Get cookie preferences from localStorage
 */
export function getFromLocalStorage(): CookieSettings | null {
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error getting cookie consent from localStorage:', error);
    return null;
  }
}

/**
 * Remove cookie preferences from localStorage
 */
export function removeFromLocalStorage(): void {
  try {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
  } catch (error) {
    console.error('Error removing cookie consent from localStorage:', error);
  }
}

/**
 * Stores cookie consent preferences in Supabase
 */
export async function storeCookieConsent(
  userId: string,
  preferences: {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    preferences: boolean;
  }
): Promise<boolean> {
  try {
    // First check if user exists
    // @ts-ignore - Necessary due to schema type mismatch
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId as any)
      .maybeSingle();
    
    if (userError || !userData) {
      console.error('User not found for cookie consent storage:', userError);
      return false;
    }
    
    // Store preferences in cookie_consents table
    // @ts-ignore - This is necessary because the auto-generated types don't include this table yet
    const { error } = await supabase
      .from('cookie_consents')
      .upsert([{
        user_id: userId,
        necessary: preferences.necessary,
        analytics: preferences.analytics,
        marketing: preferences.marketing,
        preferences: preferences.preferences,
        updated_at: new Date().toISOString()
      }], { onConflict: 'user_id' });
    
    if (error) {
      console.error('Error storing cookie consent:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception storing cookie consent:', error);
    return false;
  }
}

/**
 * Stores API key for a user
 */
export async function storeApiKeyConsent(
  userId: string,
  keyType: string,
  keyValue: string
): Promise<boolean> {
  try {
    // @ts-ignore - This is necessary because the auto-generated types don't include this table yet
    const { error } = await supabase
      .from('api_keys')
      .upsert([{
        key_type: keyType,
        key_value: keyValue,
        user_id: userId,
        updated_at: new Date().toISOString()
      }], { onConflict: 'user_id,key_type' });
    
    if (error) {
      console.error('Error storing API key consent:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception storing API key consent:', error);
    return false;
  }
}

/**
 * Gets cookie consent preferences from Supabase
 */
export async function getCookieConsent(userId: string): Promise<any> {
  try {
    // @ts-ignore - This is necessary because the auto-generated types don't include this table yet
    const { data, error } = await supabase
      .from('cookie_consents')
      .select('*')
      .eq('user_id', userId as any)
      .maybeSingle();
    
    if (error) {
      console.error('Error getting cookie consent:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception getting cookie consent:', error);
    return null;
  }
}

/**
 * Gets API key for a user
 */
export async function getApiKeyConsent(
  userId: string,
  keyType: string
): Promise<string | null> {
  try {
    // @ts-ignore - This is necessary because the auto-generated types don't include this table yet
    const { data, error } = await supabase
      .from('api_keys')
      .select('key_value')
      .eq('key_type', keyType as any)
      .eq('user_id', userId as any)
      .maybeSingle();
    
    if (error) {
      console.error('Error getting API key consent:', error);
      return null;
    }
    
    if (!data || typeof data !== 'object' || !('key_value' in data)) {
      return null;
    }
    
    return data.key_value;
  } catch (error) {
    console.error('Exception getting API key consent:', error);
    return null;
  }
}

/**
 * Revokes cookie consent preferences in Supabase
 */
export async function revokeCookieConsent(userId: string): Promise<boolean> {
  try {
    // @ts-ignore - This is necessary because the auto-generated types don't include this table yet
    const { error } = await supabase
      .from('cookie_consents')
      .delete()
      .eq('user_id', userId as any);
    
    if (error) {
      console.error('Error revoking cookie consent:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception revoking cookie consent:', error);
    return false;
  }
}

/**
 * Revokes API key for a user
 */
export async function revokeApiKeyConsent(
  userId: string,
  keyType: string
): Promise<boolean> {
  try {
    // @ts-ignore - This is necessary because the auto-generated types don't include this table yet
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('key_type', keyType as any)
      .eq('user_id', userId as any);
    
    if (error) {
      console.error('Error revoking API key consent:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception revoking API key consent:', error);
    return false;
  }
}

// Export a class for compatibility with existing code
export class CookieConsentStorage {
  static getFromLocalStorage(): CookieSettings | null {
    return getFromLocalStorage();
  }
  
  static saveToLocalStorage(preferences: CookieSettings): void {
    saveToLocalStorage(preferences);
  }
  
  static async loadFromDatabase(): Promise<CookieSettings | null> {
    // Implementation would go here
    return null;
  }
  
  static async saveToDatabase(preferences: CookieSettings): Promise<boolean> {
    // Implementation would go here
    return true;
  }
  
  static removeFromLocalStorage(): void {
    removeFromLocalStorage();
  }
  
  static async removeFromDatabase(): Promise<boolean> {
    // Implementation would go here
    return true;
  }
}

// Exports for original API
export {
  storeCookieConsent,
  getFromLocalStorage as getCookieConsent,
  removeFromLocalStorage as revokeCookieConsent,
  storeApiKeyConsent,
  getApiKeyConsent,
  revokeApiKeyConsent,
};
