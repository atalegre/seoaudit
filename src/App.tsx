
import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Toaster } from 'sonner';

// Import pages
import NotFoundPage from './pages/NotFoundPage';

// Suite Pages
import SuiteDashboard from './pages/suite/SuiteDashboard';
import KeywordsPage from './pages/suite/KeywordsPage';
import DirectoriesPage from './pages/suite/DirectoriesPage';
import SeoAnalysisPage from './pages/suite/SeoAnalysisPage';
import AioOptimizationPage from './pages/suite/AioOptimizationPage';
import LLMPresencePage from './pages/suite/LLMPresencePage';
import ContentRecommenderPage from './pages/suite/ContentRecommenderPage';
import ContentWriterPage from './pages/suite/ContentWriterPage';
import ReportsPage from './pages/suite/ReportsPage';
import UserProfilePage from './pages/suite/UserProfilePage';
import UserSettingsPage from './pages/suite/UserSettingsPage';
import UserChangePasswordPage from './pages/suite/UserChangePasswordPage';

// Components
import ScrollToTop from './components/ScrollToTop';

// Import the new PdfReportPage
import PdfReportPage from './pages/suite/PdfReportPage';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isLoggedIn = true; // For simplicity, always allow access in this demo

  useEffect(() => {
    if (!isLoggedIn) {
      console.log('User is not logged in, redirecting to login page.');
    }
  }, [isLoggedIn, location]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

const App: React.FC = () => {
  // Use only the language context that has the methods we need
  const { initializeLanguage } = useLanguage();

  useEffect(() => {
    console.log('App component mounted, initializing language.');
    initializeLanguage && initializeLanguage();
  }, [initializeLanguage]);

  return (
    <Router>
      <ScrollToTop />
      <Toaster richColors closeButton />
      <Routes>
        {/* Suite Pages */}
        <Route path="/suite" element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
          <Route index element={<SuiteDashboard />} />
          <Route path="dashboard" element={<SuiteDashboard />} />
          <Route path="keywords" element={<KeywordsPage />} />
          <Route path="directories" element={<DirectoriesPage />} />
          <Route path="seo" element={<SeoAnalysisPage />} />
          <Route path="aio" element={<AioOptimizationPage />} />
          <Route path="llm" element={<LLMPresencePage />} />
          <Route path="content-recommender" element={<ContentRecommenderPage />} />
          <Route path="content-writer" element={<ContentWriterPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="settings" element={<UserSettingsPage />} />
          <Route path="change-password" element={<UserChangePasswordPage />} />
          
          {/* PDF Report route */}
          <Route path="pdf-report" element={<PdfReportPage />} />
        </Route>

        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
