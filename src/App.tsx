
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import Index from "./pages/Index";
import ResultsPage from "./pages/ResultsPage";
import NotFoundPage from "./pages/NotFoundPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import FAQPage from "./pages/FAQPage";
import ContactPage from "./pages/ContactPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ClientDashboardPage from "./pages/dashboard/ClientDashboardPage";
import ClientPage from "./pages/dashboard/ClientPage";
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
            <ScrollToTop />
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <CookieConsent />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/como-funciona" element={<HowItWorksPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/contacto" element={<ContactPage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/recuperar-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/verification" element={<VerificationPage />} />
                <Route path="/auth/callback" element={<Navigate to="/dashboard" />} />
                
                <Route path="/dashboard" element={<DashboardLayout><Outlet /></DashboardLayout>}>
                  <Route index element={<DashboardPage />} />
                  <Route path="client" element={<ClientDashboardPage />} />
                  <Route path="client/:id" element={<ClientPage />} />
                  <Route path="clients" element={<ClientsPage />} />
                  <Route path="bulk-import" element={<BulkImportPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="blog-posts" element={<BlogPostsPage />} />
                </Route>
                
                <Route path="/suite" element={<SuiteDashboard />} />
                <Route path="/suite/seo" element={<SeoAnalysisPage />} />
                <Route path="/suite/aio" element={<AioOptimizationPage />} />
                <Route path="/suite/writer" element={<ContentWriterPage />} />
                <Route path="/suite/recommender" element={<ContentRecommenderPage />} />
                <Route path="/suite/llm" element={<LLMPresencePage />} />
                <Route path="/suite/directories" element={<SuiteDashboard />} />
                <Route path="/suite/keywords" element={<SuiteDashboard />} />
                <Route path="/suite/reports" element={<SuiteDashboard />} />
                
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/glossario" element={<GlossaryPage />} />
                <Route path="/glossario/:slug" element={<GlossaryTermPage />} />
                <Route path="/guias" element={<GuidesPage />} />
                <Route path="/guias/seo-aio-checklist" element={<SeoAioChecklistPage />} />
                
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
