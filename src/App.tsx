import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "@/i18n";

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const HomePage = lazy(() => import("./pages/HomePage"));
const ServicePage = lazy(() => import("./pages/ServicePage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogListPage = lazy(() => import("./pages/BlogListPage"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const CaseStudyPage = lazy(() => import("./pages/CaseStudyPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <LanguageProvider>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/ar" element={<HomePage />} />
                  <Route path="/en" element={<HomePage />} />
                  <Route path="/ar/services/:slug" element={<ServicePage />} />
                  <Route path="/en/services/:slug" element={<ServicePage />} />
                  <Route path="/ar/blog" element={<BlogListPage />} />
                  <Route path="/en/blog" element={<BlogListPage />} />
                  <Route path="/ar/blog/:slug" element={<BlogPage />} />
                  <Route path="/en/blog/:slug" element={<BlogPage />} />
                  <Route path="/ar/portfolio" element={<PortfolioPage />} />
                  <Route path="/en/portfolio" element={<PortfolioPage />} />
                  <Route path="/ar/case-study" element={<CaseStudyPage />} />
                  <Route path="/en/case-study" element={<CaseStudyPage />} />
                  <Route path="/ar/*" element={<HomePage />} />
                  <Route path="/en/*" element={<HomePage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </LanguageProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
