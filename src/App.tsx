
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
import Index from './pages/Index';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

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
  // For this demo, we're setting isLoggedIn to true to allow access to all pages
  // In a real app, this would check if the user is authenticated
  const isLoggedIn = true; // Always allow access in this demo

  useEffect(() => {
    if (!isLoggedIn) {
      console.log('User is not logged in, redirecting to login page.');
    }
  }, [isLoggedIn, location]);

  if (!isLoggedIn) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
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
        {/* Main landing page */}
        <Route path="/" element={<Index />} />
        
        {/* Auth routes */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/recuperar-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

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
