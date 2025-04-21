import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import Index from "./pages/Index";
import ResultsPage from "./pages/ResultsPage";
import NotFoundPage from "./pages/NotFoundPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import FAQPage from "./pages/FAQPage";
import ContactPage from "./pages/ContactPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ClientsPage from "./pages/dashboard/ClientsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import BulkImportPage from "./pages/dashboard/BulkImportPage";
import BlogPostsPage from "./pages/dashboard/BlogPostsPage";
import { supabase } from "./integrations/supabase/client";
import BlogPage from "./pages/content/BlogPage";
import BlogPostPage from "./pages/content/BlogPostPage";
import GlossaryPage from "./pages/content/GlossaryPage";
import GlossaryTermPage from "./pages/content/GlossaryTermPage";
import GuidesPage from "./pages/content/GuidesPage";
import SeoAioChecklistPage from "./pages/content/SeoAioChecklistPage";
import VerificationPage from "./pages/VerificationPage";
import { createDefaultUsers } from "./utils/auth/createDefaultUsers";
import { UserProvider } from "./contexts/UserContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import CookieConsent from "./components/CookieConsent";
import ScrollToTop from "./components/ScrollToTop";
import SuiteDashboard from "./pages/suite/SuiteDashboard";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import SeoAnalysisPage from "./pages/suite/SeoAnalysisPage";
import AioOptimizationPage from "./pages/suite/AioOptimizationPage";
import ContentWriterPage from "./pages/suite/ContentWriterPage";
import ContentRecommenderPage from "./pages/suite/ContentRecommenderPage";
import LLMPresencePage from "./pages/suite/LLMPresencePage";
import KeywordsPage from "./pages/suite/KeywordsPage";
import DirectoriesPage from "./pages/suite/DirectoriesPage";
import ChangePasswordPage from "./pages/dashboard/ChangePasswordPage";
import DetailsPage from "./pages/DetailsPage";
import ProfilePage from "./pages/dashboard/ProfilePage";

import UserProfilePage from "./pages/suite/UserProfilePage";
import UserSettingsPage from "./pages/suite/UserSettingsPage";
import UserChangePasswordPage from "./pages/suite/UserChangePasswordPage";

import ReportsPage from "./pages/suite/ReportsPage";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    const setupDefaultUsers = async () => {
      try {
        console.log("Setting up default users on app load...");
        await createDefaultUsers();
        console.log("Default users setup complete");
      } catch (error) {
        console.error("Error setting up default users:", error);
      }
    };

    setupDefaultUsers();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <LanguageProvider>
          <BrowserRouter>
            <GoogleAnalytics />
            <ScrollToTop />
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <CookieConsent />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/details" element={<DetailsPage />} />
                
                <Route path="/como-funciona" element={<HowItWorksPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                
                <Route path="/faq" element={<FAQPage />} />
                
                <Route path="/contacto" element={<ContactPage />} />
                <Route path="/contact" element={<ContactPage />} />
                
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                
                <Route path="/recuperar-password" element={<ForgotPasswordPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/verification" element={<VerificationPage />} />
                <Route path="/auth/callback" element={<Navigate to="/dashboard" />} />
                
                {/* Dashboard routes with a single DashboardLayout wrapper */}
                <Route path="/dashboard" element={<DashboardLayout><Outlet /></DashboardLayout>}>
                  <Route index element={<DashboardPage />} />
                  <Route path="clients" element={<ClientsPage />} />
                  <Route path="bulk-import" element={<BulkImportPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="blog-posts" element={<BlogPostsPage />} />
                  <Route path="change-password" element={<ChangePasswordPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                </Route>
                
                <Route path="/suite" element={<SuiteDashboard />} />
                <Route path="/suite/seo" element={<SeoAnalysisPage />} />
                
                {/* Protected routes that require authentication */}
                <Route path="/suite/aio" element={
                  <ProtectedRoute>
                    <AioOptimizationPage />
                  </ProtectedRoute>
                } />
                <Route path="/suite/directories" element={
                  <ProtectedRoute>
                    <DirectoriesPage />
                  </ProtectedRoute>
                } />
                <Route path="/suite/reports" element={
                  <ProtectedRoute>
                    <ReportsPage />
                  </ProtectedRoute>
                } />
                
                {/* Hidden routes - still accessible if accessed directly, but not shown in navigation */}
                <Route path="/suite/llm" element={<LLMPresencePage />} />
                <Route path="/suite/keywords" element={<KeywordsPage />} />
                <Route path="/suite/recommender" element={<ContentRecommenderPage />} />
                <Route path="/suite/writer" element={<ContentWriterPage />} />
                
                <Route path="/suite/profile" element={<UserProfilePage />} />
                <Route path="/suite/settings" element={<UserSettingsPage />} />
                <Route path="/suite/change-password" element={<UserChangePasswordPage />} />
                
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                
                <Route path="/glossario" element={<GlossaryPage />} />
                <Route path="/glossary" element={<GlossaryPage />} />
                
                <Route path="/glossario/:slug" element={<GlossaryTermPage />} />
                <Route path="/glossary/:slug" element={<GlossaryTermPage />} />
                
                <Route path="/guias" element={<GuidesPage />} />
                <Route path="/guides" element={<GuidesPage />} />
                
                <Route path="/guias/seo-aio-checklist" element={<SeoAioChecklistPage />} />
                <Route path="/guides/seo-aio-checklist" element={<SeoAioChecklistPage />} />
                
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </TooltipProvider>
          </BrowserRouter>
        </LanguageProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
