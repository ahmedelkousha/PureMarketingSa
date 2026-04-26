import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

// Localized Redirect Component
const LocalizedRedirect = ({ to }: { to: string }) => {
  const { language } = useLanguage();
  return <Navigate to={`/${language}${to}`} replace />;
};

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

                  {/* Language-Aware App Routes */}
                  <Route path="/:lang" element={<HomePage />} />
                  <Route path="/:lang/services/:slug" element={<ServicePage />} />
                  <Route path="/:lang/blog" element={<BlogListPage />} />
                  <Route path="/:lang/blog/:slug" element={<BlogPage />} />
                  <Route path="/:lang/portfolio" element={<PortfolioPage />} />
                  <Route path="/:lang/case-study" element={<CaseStudyPage />} />
                  <Route path="/:lang/*" element={<HomePage />} />

                  {/* Admin Routes */}
                  <Route path="/:lang/admin" element={<LoginPage />} />
                  <Route path="/:lang/admin/dashboard" element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } />

                  {/* Default fallback for admin without language */}
                  <Route path="/admin" element={<LocalizedRedirect to="/admin" />} />
                  <Route path="/admin/dashboard" element={<LocalizedRedirect to="/admin/dashboard" />} />

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
