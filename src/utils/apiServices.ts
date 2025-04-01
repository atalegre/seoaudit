
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
    console.log("ChatGPT API response:", analysisText);
    
    try {
      // Try to extract data from the ChatGPT response
      // This is a basic example - you would need more sophisticated parsing in production
      const scoreMatch = analysisText.match(/overall score.*?(\d+)/i);
      const clarityMatch = analysisText.match(/content clarity.*?(\d+)/i);
      const structureMatch = analysisText.match(/logical structure.*?(\d+)/i);
      const languageMatch = analysisText.match(/natural language.*?(\d+)/i);
      
      // Extract topics (this is a simplified approach)
      const topicsMatch = analysisText.match(/key topics:.*?\n([\s\S]*?)\n\n/i);
      const confusingMatch = analysisText.match(/confusing parts:.*?\n([\s\S]*?)(\n\n|$)/i);
      
      const topics = topicsMatch ? 
        topicsMatch[1].split('\n').map(t => t.replace(/^-\s*/, '').trim()).filter(Boolean) :
        ['Marketing Digital', 'SEO', 'Presença Online'];
        
      const confusingParts = confusingMatch ?
        confusingMatch[1].split('\n').map(t => t.replace(/^-\s*/, '').trim()).filter(Boolean) :
        ['Parágrafos muito longos', 'Informação técnica sem explicação'];
      
      return {
        score: parseInt(scoreMatch?.[1] || '70'),
        contentClarity: parseInt(clarityMatch?.[1] || '65'),
        logicalStructure: parseInt(structureMatch?.[1] || '75'),
        naturalLanguage: parseInt(languageMatch?.[1] || '80'),
        topicsDetected: topics,
        confusingParts: confusingParts
      };
    } catch (parseError) {
      console.error('Error parsing ChatGPT response:', parseError);
      return analyzeSite(url).aio;
    }
  } catch (error) {
    console.error('Error fetching ChatGPT analysis:', error);
    // Fallback to mock data
    return analyzeSite(url).aio;
  }
}

// Combined function to get both SEO and AIO analysis
export async function getFullAnalysis(url: string): Promise<AnalysisResult> {
  try {
    // Store the API key provided by the user
    const chatGptApiKey = localStorage.getItem('chatGptApiKey');
    if (chatGptApiKey) {
      console.log('Using ChatGPT API key for analysis');
    }
    
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

// Interface for the client data structure
export interface Client {
  id: number;
  name: string;
  website: string;
  contactEmail: string;
  contactName: string;
  account: string;
  status: 'active' | 'inactive' | 'pending';
  lastReport?: string;
  seoScore?: number;
  aioScore?: number;
  lastAnalysis?: Date;
}

// Function to process a CSV file with client data
export async function processBulkImport(file: File): Promise<Client[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string;
        const lines = csvData.split('\n');
        
        // Skip header row
        const header = lines[0].split(',');
        const nameIndex = header.findIndex(h => h.trim().toLowerCase() === 'name');
        const websiteIndex = header.findIndex(h => h.trim().toLowerCase() === 'website');
        const contactEmailIndex = header.findIndex(h => h.trim().toLowerCase() === 'contactemail');
        const contactNameIndex = header.findIndex(h => h.trim().toLowerCase() === 'contactname');
        
        // Process data rows
        const clients: Client[] = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue; // Skip empty lines
          
          const values = lines[i].split(',');
          if (values.length < 2) continue; // Skip invalid lines
          
          const client: Client = {
            id: Date.now() + i, // Generate a unique ID
            name: values[nameIndex]?.trim() || 'Unknown',
            website: values[websiteIndex]?.trim() || '',
            contactEmail: values[contactEmailIndex]?.trim() || '',
            contactName: values[contactNameIndex]?.trim() || '',
            account: 'Admin', // Default account
            status: 'pending' // Default status
          };
          
          if (client.website) {
            clients.push(client);
          }
        }
        
        // Store clients in localStorage
        const existingClients = JSON.parse(localStorage.getItem('clients') || '[]');
        const updatedClients = [...existingClients, ...clients];
        localStorage.setItem('clients', JSON.stringify(updatedClients));
        
        resolve(clients);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// Function to retrieve all clients
export function getClients(): Client[] {
  return JSON.parse(localStorage.getItem('clients') || '[]');
}

// Function to analyze multiple clients in sequence
export async function analyzeBulkClients(clientIds: number[]): Promise<void> {
  const clients = getClients();
  const clientsToAnalyze = clients.filter(client => clientIds.includes(client.id));
  
  for (const client of clientsToAnalyze) {
    try {
      if (!client.website) continue;
      
      // Perform the full analysis
      const result = await getFullAnalysis(client.website);
      
      // Update client with analysis results
      client.lastReport = new Date().toISOString().split('T')[0];
      client.seoScore = result.seo.score; // Updated property name
      client.aioScore = result.aio.score; // Updated property name
      client.lastAnalysis = new Date();
      client.status = 'active';
      
      // Update the client in the list
      const updatedClients = clients.map(c => 
        c.id === client.id ? client : c
      );
      
      // Save the updated client list
      localStorage.setItem('clients', JSON.stringify(updatedClients));
      
    } catch (error) {
      console.error(`Error analyzing client ${client.name}:`, error);
    }
  }
}
