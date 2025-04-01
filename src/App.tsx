
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

// Create a new QueryClient instance
const queryClient = new QueryClient();

const AuthCallback = () => {
  useEffect(() => {
    // Handle the OAuth callback
    // The supabase client will automatically handle the auth exchange
    const handleAuthCallback = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error during auth callback:", error);
        }
        // Redirect to the dashboard or home page after successful auth
        window.location.href = '/dashboard';
      } catch (error) {
        console.error("Exception during auth callback:", error);
        window.location.href = '/signin';
      }
    };

    handleAuthCallback();
  }, []);

  // Show a loading state while processing the auth callback
  return <div className="flex items-center justify-center min-h-screen">Processando autenticação...</div>;
};

const App = () => {
  return (
    <React.StrictMode>
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
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/client" element={<ClientDashboardPage />} />
              <Route path="/dashboard/client/:id" element={<ClientPage />} />
              <Route path="/dashboard/clients" element={<ClientsPage />} />
              <Route path="/dashboard/bulk-import" element={<BulkImportPage />} />
              <Route path="/dashboard/settings" element={<SettingsPage />} />
              <Route path="/dashboard/blog-posts" element={<BlogPostsPage />} />
              
              {/* Rotas de conteúdo */}
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/glossario" element={<GlossaryPage />} />
              <Route path="/glossario/:slug" element={<GlossaryTermPage />} />
              <Route path="/guias" element={<GuidesPage />} />
              <Route path="/guias/seo-aio-checklist" element={<SeoAioChecklistPage />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
