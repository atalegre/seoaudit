
import { supabase } from '@/integrations/supabase/client';
import { CookieSettings } from './types';

// Constant key for localStorage
const COOKIE_CONSENT_KEY = 'cookie_consent_settings';
const API_KEY_CONSENT_KEY = 'api_key_consent';

/**
 * Save cookie settings to localStorage
 */
export function saveToLocalStorage(settings: CookieSettings): void {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving cookie consent to local storage:', e);
  }
}

/**
 * Save cookie settings to database if user is authenticated
 */
export async function saveToDatabase(userId: string, settings: CookieSettings): Promise<void> {
  try {
    // This is a stub implementation since the cookie_consents table doesn't exist yet
    console.log('Would save cookie consent to database for user:', userId, settings);
    
    // In a real implementation, we would do an insert or update to a cookie_consents table
    // Example of how it would be implemented if the table existed:
    /*
    const { error } = await supabase
      .from('cookie_consents')
      .upsert([{
        user_id: userId,
        necessary: settings.necessary,
        analytics: settings.analytics,
        marketing: settings.marketing,
        preferences: settings.preferences,
        updated_at: new Date().toISOString()
      }], { onConflict: 'user_id' });
    
    if (error) throw error;
    */
  } catch (e) {
    console.error('Error saving cookie consent to database:', e);
  }
}

/**
 * Save API key consent to database
 */
export async function saveApiKeyToDatabase(userId: string, keyType: string, keyValue: string): Promise<void> {
  try {
    // Stub implementation for when the API keys table exists
    console.log('Would save API key to database for user:', userId, keyType);
    
    // Example of how it would be implemented if the table was correctly typed:
    /*
    const { error } = await supabase
      .from('api_keys')
      .upsert([{
        key_type: keyType,
        key_value: keyValue,
        user_id: userId,
        updated_at: new Date().toISOString()
      }], { onConflict: 'user_id,key_type' });
    
    if (error) throw error;
    */
  } catch (e) {
    console.error('Error saving API key consent to database:', e);
  }
}

/**
 * Get cookie settings from localStorage
 */
export function getFromLocalStorage(): CookieSettings | null {
  try {
    const storedSettings = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!storedSettings) return null;
    return JSON.parse(storedSettings) as CookieSettings;
  } catch (e) {
    console.error('Error getting cookie consent from local storage:', e);
    return null;
  }
}

/**
 * Get cookie settings from database
 */
export async function getFromDatabase(userId: string): Promise<CookieSettings | null> {
  try {
    // This is a stub implementation since the cookie_consents table doesn't exist yet
    console.log('Would get cookie consent from database for user:', userId);
    
    // Example of how it would be implemented if the table existed:
    /*
    const { data, error } = await supabase
      .from('cookie_consents')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null;  // No record found
      }
      throw error;
    }
    
    return {
      necessary: data.necessary,
      analytics: data.analytics,
      marketing: data.marketing,
      preferences: data.preferences
    };
    */
    
    return null;
  } catch (e) {
    console.error('Error getting cookie consent from database:', e);
    return null;
  }
}

/**
 * Get API key from database
 */
export async function getApiKeyFromDatabase(userId: string, keyType: string): Promise<string | null> {
  try {
    // Stub implementation for when the API keys table exists
    console.log('Would get API key from database for user:', userId, keyType);
    
    // Example of how it would be implemented if the table was correctly typed:
    /*
    const { data, error } = await supabase
      .from('api_keys')
      .select('key_value')
      .eq('key_type', keyType)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null;  // No record found
      }
      throw error;
    }
    
    return data.key_value;
    */
    
    return null;
  } catch (e) {
    console.error('Error getting API key from database:', e);
    return null;
  }
}

/**
 * Remove cookie settings from localStorage
 */
export function removeFromLocalStorage(): void {
  try {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
  } catch (e) {
    console.error('Error removing cookie consent from local storage:', e);
  }
}

/**
 * Remove cookie settings from database
 */
export async function removeFromDatabase(userId: string): Promise<void> {
  try {
    // This is a stub implementation since the cookie_consents table doesn't exist yet
    console.log('Would remove cookie consent from database for user:', userId);
    
    // Example of how it would be implemented if the table existed:
    /*
    const { error } = await supabase
      .from('cookie_consents')
      .delete()
      .eq('user_id', userId);
    
    if (error) throw error;
    */
  } catch (e) {
    console.error('Error removing cookie consent from database:', e);
  }
}

/**
 * Remove API key from database
 */
export async function removeApiKeyFromDatabase(userId: string, keyType: string): Promise<void> {
  try {
    // Stub implementation for when the API keys table exists
    console.log('Would remove API key from database for user:', userId, keyType);
    
    // Example of how it would be implemented if the table was correctly typed:
    /*
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('key_type', keyType)
      .eq('user_id', userId);
    
    if (error) throw error;
    */
  } catch (e) {
    console.error('Error removing API key from database:', e);
  }
}

/**
 * Store cookie consent settings in localStorage and database
 */
export const storeCookieConsent = saveToLocalStorage;

/**
 * Get cookie consent settings from localStorage or database
 */
export const getCookieConsent = getFromLocalStorage;

/**
 * Remove cookie consent settings from localStorage and database
 */
export const revokeCookieConsent = removeFromLocalStorage;

/**
 * Store API key consent in database
 */
export function storeApiKeyConsent(userId: string, keyType: string, keyValue: string): void {
  if (userId) {
    saveApiKeyToDatabase(userId, keyType, keyValue);
  }
}

/**
 * Get API key consent from database
 */
export function getApiKeyConsent(userId: string, keyType: string): Promise<string | null> {
  if (!userId) return Promise.resolve(null);
  return getApiKeyFromDatabase(userId, keyType);
}

/**
 * Remove API key consent from database
 */
export function revokeApiKeyConsent(userId: string, keyType: string): void {
  if (userId) {
    removeApiKeyFromDatabase(userId, keyType);
  }
}

// Export the CookieConsentStorage class
export class CookieConsentStorage {
  static saveToLocalStorage = saveToLocalStorage;
  static getFromLocalStorage = getFromLocalStorage;
  static removeFromLocalStorage = removeFromLocalStorage;
  static saveToDatabase = saveToDatabase;
  static loadFromDatabase = getFromDatabase;
  static removeFromDatabase = removeFromDatabase;
}
