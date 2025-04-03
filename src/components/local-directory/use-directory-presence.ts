
import { useState, useEffect } from 'react';
import { DirectoryPresenceProps, DirectoryPresenceResult } from './types';
import { PAI_DIRECTORY } from './directory-data';
import { extractDomainFromUrl, areDomainsRelated } from '@/utils/domainUtils';

export const useDirectoryPresence = ({ url, companyName }: DirectoryPresenceProps) => {
  const [loading, setLoading] = useState(true);
  const [paiPresence, setPaiPresence] = useState<DirectoryPresenceResult | null>(null);

  useEffect(() => {
    // Improved method to check PAI.pt presence
    const checkPaiPresence = async () => {
      setLoading(true);
      
      try {
        // Simulate API call with a timeout
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (!url) {
          setPaiPresence({ found: false });
          return;
        }
        
        // Extract domain from URL using the helper function
        const domain = extractDomainFromUrl(url);
        console.log("Checking PAI presence for domain:", domain);
        
        if (!domain) {
          setPaiPresence({ found: false });
          return;
        }
        
        // Find company in directory
        const foundListing = findCompanyInDirectory(domain);
        
        if (foundListing) {
          console.log("Found PAI listing for:", foundListing.name);
          
          // Check name match if provided
          let nameMatch = true;
          if (companyName) {
            const normalizedCompanyName = companyName.toLowerCase();
            const normalizedListingName = foundListing.name.toLowerCase();
            
            nameMatch = 
              normalizedCompanyName.includes(normalizedListingName) || 
              normalizedListingName.includes(normalizedCompanyName) ||
              // Check for common word matches
              normalizedCompanyName.split(' ').some(word => 
                word.length > 3 && normalizedListingName.includes(word)
              );
          }
          
          setPaiPresence({
            found: true,
            name: foundListing.name,
            phone: foundListing.phone,
            url: foundListing.url,
            paiUrl: foundListing.paiUrl,
            nameMatch: nameMatch,
            phoneMatch: true, // Simplified for demo
            urlMatch: true    // Simplified for demo
          });
        } else {
          console.log("No PAI listing found for domain:", domain);
          setPaiPresence({
            found: false
          });
        }
      } catch (error) {
        console.error('Error checking PAI presence:', error);
        setPaiPresence({ found: false });
      } finally {
        setLoading(false);
      }
    };
    
    if (url) {
      checkPaiPresence();
    } else {
      setLoading(false);
      setPaiPresence({ found: false });
    }
  }, [url, companyName]);

  // Helper function to find company in directory by domain
  const findCompanyInDirectory = (domain: string) => {
    if (!domain) return null;
    
    return PAI_DIRECTORY.find(listing => 
      listing.domains.some(listingDomain => 
        areDomainsRelated(domain, listingDomain)
      )
    );
  };

  return { loading, paiPresence };
};
