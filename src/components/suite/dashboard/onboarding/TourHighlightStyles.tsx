
import React, { useEffect } from 'react';

const TourHighlightStyles: React.FC = () => {
  useEffect(() => {
    // Add CSS for the pulsing highlight effect
    const style = document.createElement('style');
    style.innerHTML = `
      .onboarding-target {
        position: relative;
        z-index: 60;
        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.4);
        border-radius: 8px;
      }
      .pulse-highlight {
        animation: pulse-border 2s infinite;
      }
      @keyframes pulse-border {
        0% {
          box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
        }
        70% {
          box-shadow: 0 0 0 6px rgba(99, 102, 241, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
};

export default TourHighlightStyles;
