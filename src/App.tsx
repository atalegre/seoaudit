import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Toaster } from 'sonner';

// Import pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerificationPage from './pages/VerificationPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';

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
  const { isLoggedIn } = useAuth();
  const location = useLocation();

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
  const { initializeAuth } = useAuth();
  const { loadLanguage } = useLanguage();

  useEffect(() => {
    console.log('App component mounted, initializing authentication and language.');
    initializeAuth();
    loadLanguage();
  }, [initializeAuth, loadLanguage]);

  return (
    <Router>
      <ScrollToTop />
      <Toaster richColors closeButton />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogPostPage />} />

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
          
          {/* Add the new PDF Report route */}
          <Route path="pdf-report" element={<PdfReportPage />} />
        </Route>

        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
