
import * as React from "react"

// Define a consistent mobile breakpoint to use throughout the app
export const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => 
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false
  )

  React.useEffect(() => {
    // Use a proper resize handler with debounce
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Add event listener
    window.addEventListener("resize", handleResize)
    
    // Initial check
    handleResize()
    
    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isMobile
}
