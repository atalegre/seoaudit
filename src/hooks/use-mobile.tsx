
import { useState, useEffect } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check initially
    checkIfMobile();
    
    // Set up event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  return isMobile;
}

// Alias for useMobile for backward compatibility
export const useIsMobile = useMobile;

// Add useBreakpoint hook for responsive design
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('md');
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < 480) {
        setBreakpoint('xs');
      } else if (width < 640) {
        setBreakpoint('sm');
      } else if (width < 768) {
        setBreakpoint('md');
      } else if (width < 1024) {
        setBreakpoint('lg');
      } else {
        setBreakpoint('xl');
      }
      
      setIsMobile(width < 768);
    };
    
    // Check initially
    updateBreakpoint();
    
    // Set up event listener
    window.addEventListener('resize', updateBreakpoint);
    
    // Clean up
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);
  
  return { breakpoint, isMobile };
}
