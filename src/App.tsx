
import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
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

const queryClient = new QueryClient();

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(true);
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        // Check if there's an OTP expired error in the URL
        const urlParams = new URLSearchParams(window.location.hash.substring(1));
        const errorCode = urlParams.get('error_code');
        const errorType = urlParams.get('error');
        
        if (errorType === 'access_denied' && errorCode === 'otp_expired') {
          // If OTP is expired, redirect to verification page
          const email = localStorage.getItem('pendingVerificationEmail');
          if (email) {
            navigate('/verification', { state: { email, expired: true } });
          } else {
            // If we don't have the email, redirect to sign in
            navigate('/signin');
          }
        } else if (error) {
          console.error("Auth callback error:", error);
          navigate('/signin');
        } else if (data.session) {
          // Successful auth, redirect to dashboard
          navigate('/dashboard/client');
        } else {
          navigate('/signin');
        }
      } catch (error) {
        console.error("Exception during auth callback:", error);
        navigate('/signin');
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (isProcessing) {
    return <div className="flex items-center justify-center min-h-screen">Processando autenticação...</div>;
  }
  
  return null;
};

const App = () => {
  // Create default users on app init
  useEffect(() => {
    createDefaultUsers();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
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
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/client" element={<ClientDashboardPage />} />
            <Route path="/dashboard/client/:id" element={<ClientPage />} />
            <Route path="/dashboard/clients" element={<ClientsPage />} />
            <Route path="/dashboard/bulk-import" element={<BulkImportPage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
            <Route path="/dashboard/blog-posts" element={<BlogPostsPage />} />
            
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
    </QueryClientProvider>
  );
};

export default App;
