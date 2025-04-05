
import { supabase } from '@/integrations/supabase/client';
import { CookieSettings, CONSENT_KEY } from './types';

/**
 * Storage-related utilities for cookie consent
 */
export const CookieConsentStorage = {
  /**
   * Get stored cookie consent settings from localStorage
   */
  getFromLocalStorage(): CookieSettings | null {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error('Error reading cookie consent from localStorage:', e);
      return null;
    }
  },
  
  /**
   * Save cookie consent settings to localStorage
   */
  saveToLocalStorage(settings: CookieSettings): void {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving cookie consent to localStorage:', e);
    }
  },
  
  /**
   * Remove cookie consent settings from localStorage
   */
  removeFromLocalStorage(): void {
    localStorage.removeItem(CONSENT_KEY);
  },
  
  /**
   * Save cookie consent settings to database if user is authenticated
   */
  async saveToDatabase(settings: CookieSettings): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        return false;
      }
      
      const userId = session.user.id;
      
      // Store in the api_keys table under a special key_type
      const { error } = await supabase
        .from('api_keys')
        .upsert({
          key_type: 'cookie_consent',
          key_value: JSON.stringify(settings),
          user_id: userId,
          updated_at: new Date().toISOString()
        }, { onConflict: 'key_type, user_id' });
        
      if (error) {
        console.error('Error saving cookie consent to database:', error);
        return false;
      }
      
      console.log('Cookie consent preferences saved to database');
      return true;
    } catch (e) {
      console.error('Error saving cookie consent to database:', e);
      return false;
    }
  },
  
  /**
   * Remove cookie consent settings from database if user is authenticated
   */
  async removeFromDatabase(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        return false;
      }
      
      const userId = session.user.id;
      
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('key_type', 'cookie_consent')
        .eq('user_id', userId);
        
      if (error) {
        console.error('Error deleting cookie consent from database:', error);
        return false;
      }
      
      console.log('Cookie consent preferences removed from database');
      return true;
    } catch (e) {
      console.error('Error removing cookie consent from database:', e);
      return false;
    }
  },
  
  /**
   * Load consent settings from database if user is authenticated
   */
  async loadFromDatabase(): Promise<CookieSettings | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        return null;
      }
      
      const userId = session.user.id;
      
      const { data, error } = await supabase
        .from('api_keys')
        .select('key_value')
        .eq('key_type', 'cookie_consent')
        .eq('user_id', userId)
        .single();
      
      if (error || !data) {
        return null;
      }
      
      return JSON.parse(data.key_value);
    } catch (e) {
      console.error('Error loading cookie consent from database:', e);
      return null;
    }
  }
};
