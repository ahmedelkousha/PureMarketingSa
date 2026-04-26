import { useEffect, Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';

// Lazy load below-the-fold components
const StatsSection = lazy(() => import('@/components/StatsSection'));
const PartnersCarousel = lazy(() => import('@/components/PartnersCarousel'));
const CaseStudySection = lazy(() => import('@/components/CaseStudySection'));
const ServicesSection = lazy(() => import('@/components/ServicesSection'));
const AboutSection = lazy(() => import('@/components/AboutSection'));
const PortfolioSection = lazy(() => import('@/components/PortfolioSection'));
const WhyUsSection = lazy(() => import('@/components/WhyUsSection'));
const TestimonialsSection = lazy(() => import('@/components/TestimonialsSection'));
const ContactSection = lazy(() => import('@/components/ContactSection'));
const BlogSection = lazy(() => import('@/components/BlogSection'));
const Footer = lazy(() => import('@/components/Footer'));
const WhatsAppButton = lazy(() => import('@/components/WhatsAppButton'));
const ScrollToTopButton = lazy(() => import('@/components/ScrollToTopButton'));

const HomePage = () => {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const location = useLocation();

  // Handle scroll to top when navigating without hash
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname, location.hash]);

  // Handle hash navigation
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <>
      <Helmet>
        <title>{t('seo.home.title')}</title>
        <meta name="description" content={t('seo.home.description')} />
        <link rel="canonical" href={`https://puremarketingsa.com/${language}`} />
        <link rel="alternate" hrefLang="ar" href="https://puremarketingsa.com/ar" />
        <link rel="alternate" hrefLang="en" href="https://puremarketingsa.com/en" />
        <link rel="alternate" hrefLang="x-default" href="https://puremarketingsa.com/ar" />
        <html lang={language} dir={isRTL ? 'rtl' : 'ltr'} />
        
        {/* Open Graph */}
        <meta property="og:title" content={t('seo.home.title')} />
        <meta property="og:description" content={t('seo.home.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://puremarketingsa.com/${language}`} />
        <meta property="og:image" content="https://puremarketingsa.com/og-image.png" />
        <meta property="og:site_name" content="Pure Marketing" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('seo.home.title')} />
        <meta name="twitter:description" content={t('seo.home.description')} />
      </Helmet>

      <Header />
      
      <main className="pt-20">
        <HeroSection /> 
        <Suspense fallback={null}>
          <StatsSection />
          <PartnersCarousel />
          <CaseStudySection />
          <ServicesSection />
          <AboutSection />
          <PortfolioSection />
          <WhyUsSection />
          <TestimonialsSection />
          <ContactSection />
          <BlogSection />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer />
        <WhatsAppButton />
        <ScrollToTopButton />
      </Suspense>
    </>
  );
};

export default HomePage;
