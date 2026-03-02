import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import PartnersCarousel from '@/components/PartnersCarousel';
import CaseStudySection from '@/components/CaseStudySection';
import ServicesSection from '@/components/ServicesSection';
import AboutSection from '@/components/AboutSection';
import PortfolioSection from '@/components/PortfolioSection';
import WhyUsSection from '@/components/WhyUsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import BlogSection from '@/components/BlogSection';
import ContactSection from '@/components/ContactSection';
import WhatsAppButton from '@/components/WhatsAppButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';

const HomePage = () => {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const location = useLocation();

  // Handle scroll to top when navigating without hash
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname]);

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
        <link rel="canonical" href={`https://puremarketing.sa/${language}`} />
        <html lang={language} dir={isRTL ? 'rtl' : 'ltr'} />
        
        {/* Open Graph */}
        <meta property="og:title" content={t('seo.home.title')} />
        <meta property="og:description" content={t('seo.home.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://puremarketing.sa/${language}`} />
        <meta property="og:locale" content={language === 'ar' ? 'ar_SA' : 'en_US'} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('seo.home.title')} />
        <meta name="twitter:description" content={t('seo.home.description')} />
      </Helmet>

      <Header />
      
      <main className="pt-20">
        <HeroSection />
        <StatsSection />
        <PartnersCarousel />
        <CaseStudySection />
        <ServicesSection />
        <AboutSection />
        <PortfolioSection />
        <WhyUsSection />
        <TestimonialsSection />
        <BlogSection />
        <ContactSection />
      </main>

      <Footer />
      <WhatsAppButton />
      <ScrollToTopButton />
    </>
  );
};

export default HomePage;
