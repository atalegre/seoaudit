
import * as React from "react"

// Define a consistent mobile breakpoint to use throughout the app
export const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => 
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false
  )

  React.useEffect(() => {
    // Use a proper resize handler with debounce
    let timeoutId: number | null = null;
    
    const handleResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Debounce resize event to avoid excessive re-renders
      timeoutId = window.setTimeout(() => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      }, 150); // 150ms debounce
    }
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Initial check
    handleResize();
    
    // Cleanup listener and timeout on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }, [])

  return isMobile
}

// Additional utility for more granular breakpoint control
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState(() => {
    if (typeof window === "undefined") return "desktop"
    
    const width = window.innerWidth;
    if (width < 640) return "xs" // extra small
    if (width < 768) return "sm" // small
    if (width < 1024) return "md" // medium
    if (width < 1280) return "lg" // large
    return "xl" // extra large
  })
  
  React.useEffect(() => {
    let timeoutId: number | null = null;
    
    const handleResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Debounce resize event
      timeoutId = window.setTimeout(() => {
        const width = window.innerWidth;
        if (width < 640) setBreakpoint("xs")
        else if (width < 768) setBreakpoint("sm")
        else if (width < 1024) setBreakpoint("md")
        else if (width < 1280) setBreakpoint("lg")
        else setBreakpoint("xl")
      }, 150); // 150ms debounce
    }
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }, [])
  
  return {
    breakpoint,
    isXs: breakpoint === "xs",
    isSm: breakpoint === "sm",
    isMd: breakpoint === "md",
    isLg: breakpoint === "lg",
    isXl: breakpoint === "xl",
    isMobile: breakpoint === "xs" || breakpoint === "sm",
    isTablet: breakpoint === "md",
    isDesktop: breakpoint === "lg" || breakpoint === "xl"
  }
}
