
import { AnalysisResult, analyzeSite } from './analyzerUtils';

// Function to get the Google Page Insights data
export async function getPageInsightsData(url: string): Promise<any> {
  const apiKey = localStorage.getItem('googlePageInsightsKey');
  
  if (!apiKey) {
    console.error('Google Page Insights API key not found');
    // Use mock data when API key is not available
    return analyzeSite(url).seo;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch Page Insights data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Page Insights data:', error);
    // Fallback to mock data
    return analyzeSite(url).seo;
  }
}

// Function to get the ChatGPT analysis
export async function getChatGptAnalysis(url: string, content: string): Promise<any> {
  const apiKey = localStorage.getItem('chatGptApiKey');
  
  if (!apiKey) {
    console.error('ChatGPT API key not found');
    // Use mock data when API key is not available
    return analyzeSite(url).aio;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an AI content analyzer that evaluates websites for clarity, structure, and natural language quality. Provide scores from 0-100 for content clarity, logical structure, and natural language, plus an overall score. Identify key topics and confusing parts."
          },
          {
            role: "user",
            content: `Analyze this website content from ${url}: ${content}`
          }
        ]
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch ChatGPT analysis');
    }
    
    const data = await response.json();
    // Process the ChatGPT response into our expected format
    const analysisText = data.choices[0]?.message?.content || '';
    
    // Extract scores and topics from the analysis text
    // In a real implementation, this would need more sophisticated parsing
    // For now we'll return mock data
    return analyzeSite(url).aio;
  } catch (error) {
    console.error('Error fetching ChatGPT analysis:', error);
    // Fallback to mock data
    return analyzeSite(url).aio;
  }
}

// Combined function to get both SEO and AIO analysis
export async function getFullAnalysis(url: string): Promise<AnalysisResult> {
  try {
    // For demonstration purposes, we'll use mock content
    // In a real app, we would fetch the actual content from the URL
    const mockContent = "This is sample content from the website that would be analyzed";
    
    // Check if API keys are available
    const googleApiKey = localStorage.getItem('googlePageInsightsKey');
    const openaiApiKey = localStorage.getItem('chatGptApiKey');
    
    if (!googleApiKey || !openaiApiKey) {
      console.log('Using mock data for analysis as API keys are missing');
      return analyzeSite(url);
    }
    
    // In a real implementation, we would:
    // 1. Fetch the SEO data from Google Page Insights
    // 2. Fetch the content of the website
    // 3. Send the content to ChatGPT for AIO analysis
    // 4. Combine the results
    
    // For now, we'll return the mock data from analyzeSite
    return analyzeSite(url);
  } catch (error) {
    console.error('Error performing full analysis:', error);
    return analyzeSite(url);
  }
}
