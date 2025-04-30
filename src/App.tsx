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

// Import pages for main navigation routes
import HowItWorksPage from './pages/HowItWorksPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';

// Import content pages
import BlogPage from './pages/content/BlogPage';
import GuidesPage from './pages/content/GuidesPage';
import GlossaryPage from './pages/content/GlossaryPage';
import SeoAioChecklistPage from './pages/content/SeoAioChecklistPage';

// Components
import ScrollToTop from './components/ScrollToTop';
import AuthRequiredRoute from './components/auth/AuthRequiredRoute';

// Import the new PdfReportPage
import PdfReportPage from './pages/suite/PdfReportPage';

// Auth Provider
import { UserProvider } from './contexts/UserContext';

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
      <UserProvider>
        <ScrollToTop />
        <Toaster richColors closeButton />
        <Routes>
          {/* Main landing page */}
          <Route path="/" element={<Index />} />
          
          {/* Main navigation routes */}
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/como-funciona" element={<HowItWorksPage />} /> {/* PT version */}
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/contacto" element={<ContactPage />} /> {/* PT version */}
          
          {/* Content pages */}
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/guias" element={<GuidesPage />} /> {/* PT version */}
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/glossario" element={<GlossaryPage />} /> {/* PT version */}
          <Route path="/guides/seo-aio-checklist" element={<SeoAioChecklistPage />} />
          <Route path="/guias/seo-aio-checklist" element={<SeoAioChecklistPage />} /> {/* PT version */}
          
          {/* Auth routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/recuperar-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Suite Pages */}
          <Route path="/suite" element={<Outlet />}>
            <Route index element={<SuiteDashboard />} />
            <Route path="dashboard" element={<SuiteDashboard />} />
            <Route path="keywords" element={<KeywordsPage />} />
            <Route path="seo" element={<SeoAnalysisPage />} />
            
            {/* Protected Routes */}
            <Route path="directories" element={
              <AuthRequiredRoute>
                <DirectoriesPage />
              </AuthRequiredRoute>
            } />
            <Route path="aio" element={
              <AuthRequiredRoute>
                <AioOptimizationPage />
              </AuthRequiredRoute>
            } />
            <Route path="reports" element={
              <AuthRequiredRoute>
                <ReportsPage />
              </AuthRequiredRoute>
            } />
            
            {/* Other suite routes */}
            <Route path="llm" element={<LLMPresencePage />} />
            <Route path="content-recommender" element={<ContentRecommenderPage />} />
            <Route path="content-writer" element={<ContentWriterPage />} />
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="settings" element={<UserSettingsPage />} />
            <Route path="change-password" element={<UserChangePasswordPage />} />
            
            {/* PDF Report route */}
            <Route path="pdf-report" element={<PdfReportPage />} />
          </Route>

          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </UserProvider>
    </Router>
  );
};

export default App;
