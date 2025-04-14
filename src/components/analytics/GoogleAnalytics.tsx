
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initGA, pageview } from '@/utils/analytics/googleAnalytics';

const GoogleAnalytics: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize Google Analytics when component mounts
    initGA();
  }, []);

  useEffect(() => {
    // Track page views whenever the route changes
    pageview(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return null; // This component doesn't render anything
};

export default GoogleAnalytics;
