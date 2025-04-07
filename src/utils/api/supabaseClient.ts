
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch client analysis history from Supabase
 */
export async function getClientAnalysisHistory(clientId: number): Promise<any[]> {
  try {
    // Convert clientId to string as expected by Supabase
    const clientIdStr = clientId.toString();
    
    // @ts-ignore - Ignoring type issues with the filter
    const { data, error } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('client_id', clientIdStr)
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
export async function storeApiKey(
  userEmail: string, 
  apiKey: string | null = null,
  refreshToken: string | null = null
): Promise<void> {
  try {
    if (!userEmail) {
      throw new Error('User email is required to store API key');
    }
    
    // Get user ID from email first
    // @ts-ignore - Ignoring type issues with the filter
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', userEmail)
      .single();
    
    if (userError) {
      console.error('User not found:', userError);
      throw new Error('User not found');
    }
    
    // Safely extract userId with type check
    const userId = userData && typeof userData === 'object' && 'id' in userData ? userData.id : null;
    
    if (!userId) {
      throw new Error('User ID not found');
    }
    
    // Now insert/update the API key with user_id
    // @ts-ignore - Necessary due to schema type mismatch
    const { error } = await supabase
      .from('api_keys')
      .upsert([{
        user_id: userId,
        key_type: 'google',
        key_value: apiKey || '', // Empty string for null values
        updated_at: new Date().toISOString()
      }], { onConflict: 'user_id,key_type' });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error storing API key:', error);
    throw error;
  }
}

/**
 * Get Google API key for a user
 */
export async function getApiKey(userEmail: string): Promise<any | null> {
  try {
    if (!userEmail) {
      throw new Error('User email is required to get API key');
    }
    
    // Get user ID from email first
    // @ts-ignore - Ignoring type issues with the filter
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', userEmail)
      .single();
    
    if (userError) {
      if (userError.code === 'PGRST116') {
        // No record found - this is not an error for our purposes
        return null;
      }
      throw userError;
    }
    
    // Safely extract userId with type check
    const userId = userData && typeof userData === 'object' && 'id' in userData ? userData.id : null;
    
    if (!userId) {
      return null;
    }
    
    // Now get the API key with user_id
    // @ts-ignore - Necessary due to schema type mismatch
    const { data, error } = await supabase
      .from('api_keys')
      .select('key_value')
      .eq('user_id', userId)
      .eq('key_type', 'google')
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No record found - this is not an error for our purposes
        return null;
      }
      throw error;
    }
    
    // Safe access with type check
    if (!data || typeof data !== 'object' || !('key_value' in data)) {
      return null;
    }
    
    return {
      apiKey: data.key_value,
      refreshToken: null // We're not storing refresh tokens separately now
    };
  } catch (error) {
    console.error('Error getting API key:', error);
    return null;
  }
}

/**
 * Save analysis result to the database
 */
export async function saveAnalysisResult(
  clientId: number,
  analysisResult: any
): Promise<void> {
  try {
    // Extract required fields from the analysis result
    const { url, seo, aio } = analysisResult;
    
    // Convert clientId to string since the database expects string IDs
    const clientIdStr = clientId.toString();
    
    // @ts-ignore - Necessary due to schema type mismatch
    const { error } = await supabase
      .from('analysis_results')
      .insert([{
        client_id: clientIdStr,
        url: url || '',
        seo_data: seo || null,
        aio_data: aio || null,
        seo_score: seo?.score || 0,
        aio_score: aio?.score || 0,
        overall_status: 'completed',
        created_at: new Date().toISOString()
      }]);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error saving analysis result:', error);
    throw error;
  }
}
