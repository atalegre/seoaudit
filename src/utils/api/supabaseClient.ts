
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch client analysis history from Supabase
 */
export async function getClientAnalysisHistory(clientId: number): Promise<any[]> {
  try {
    // @ts-ignore - This is necessary because the generated types don't include this table yet
    const { data, error } = await supabase
      .from('analysis_history')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching analysis history:', error);
    return [];
  }
}

/**
 * Store Google API key for a user
 * Simplified to take only user email and api key
 */
export async function storeApiKey(userEmail: string, apiKey: string | null): Promise<void> {
  try {
    if (!userEmail) {
      throw new Error('User email is required to store API key');
    }
    
    // @ts-ignore - This is necessary because the generated types don't include this table yet
    const { error } = await supabase
      .from('user_api_keys')
      .upsert({
        user_email: userEmail,
        api_key: apiKey,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_email'
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error storing API key:', error);
    throw error;
  }
}

/**
 * Get Google API key for a user
 * Simplified to take only user email
 */
export async function getApiKey(userEmail: string): Promise<string | null> {
  try {
    if (!userEmail) {
      throw new Error('User email is required to get API key');
    }
    
    // @ts-ignore - This is necessary because the generated types don't include this table yet
    const { data, error } = await supabase
      .from('user_api_keys')
      .select('api_key')
      .eq('user_email', userEmail)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No record found - this is not an error for our purposes
        return null;
      }
      throw error;
    }
    
    return data?.api_key || null;
  } catch (error) {
    console.error('Error getting API key:', error);
    return null;
  }
}
