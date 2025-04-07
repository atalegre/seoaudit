
import { supabase } from '@/integrations/supabase/client';

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

// Export a class for compatibility
export class CookieConsentStorage {
  static async store(userId: string, preferences: any): Promise<boolean> {
    return storeCookieConsent(userId, preferences);
  }
  
  static async get(userId: string): Promise<any> {
    return getCookieConsent(userId);
  }
  
  static async revoke(userId: string): Promise<boolean> {
    return revokeCookieConsent(userId);
  }
}
