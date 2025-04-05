
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch client analysis history from Supabase
 */
export async function getClientAnalysisHistory(clientId: number): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('analysis_results')
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
 */
export async function storeApiKey(userEmail: string, website: string, apiKey: string | null = null, refreshToken: string | null = null): Promise<void> {
  try {
    if (!userEmail) {
      throw new Error('User email is required to store API key');
    }
    
    const { error } = await supabase
      .from('api_keys')
      .upsert({
        user_email: userEmail,
        website: website,
        api_key: apiKey,
        refresh_token: refreshToken,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_email,website'
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error storing API key:', error);
    throw error;
  }
}

/**
 * Get Google API key for a user
 */
export async function getApiKey(userEmail: string, website: string): Promise<any | null> {
  try {
    if (!userEmail) {
      throw new Error('User email is required to get API key');
    }
    
    const { data, error } = await supabase
      .from('api_keys')
      .select('api_key, refresh_token')
      .eq('user_email', userEmail)
      .eq('website', website)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No record found - this is not an error for our purposes
        return null;
      }
      throw error;
    }
    
    return {
      apiKey: data.api_key,
      refreshToken: data.refresh_token
    };
  } catch (error) {
    console.error('Error getting API key:', error);
    return null;
  }
}
