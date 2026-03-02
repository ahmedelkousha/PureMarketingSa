import { useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Helmet } from 'react-helmet-async';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import BackButton from '@/components/BackButton';

const serviceKeys: Record<string, string> = {
  'social-media-management': 'socialMedia',
  'paid-ads-campaigns': 'paidAds',
  'video-editing-motion-graphics': 'motionGraphics',
  'websites-ecommerce': 'websites',
};

const ServicePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();
  useScrollToTop();

  const serviceKey = slug ? serviceKeys[slug] : null;

  if (!serviceKey) {
    return <Navigate to={`/${language}`} replace />;
  }

  const steps = ['step1', 'step2', 'step3', 'step4', 'step5'];

  const handleContactClick = () => {
    navigate(`/${language}#contact`);
  };

  return (
    <>
      <Helmet>
        <title>{t(`servicePages.${serviceKey}.title`)} | Pure Marketing</title>
        <meta name="description" content={t(`servicePages.${serviceKey}.description`)} />
        <link rel="canonical" href={`https://puremarketing.sa/${language}/services/${slug}`} />
        <html lang={language} dir={isRTL ? 'rtl' : 'ltr'} />
      </Helmet>

      <Header />

      <main className="pt-20">
        <div className="container-custom pt-6">
          <BackButton />
        </div>
        {/* Hero Section */}
        <section className="hero-section py-20 lg:py-32">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              >
                {t(`servicePages.${serviceKey}.title`)}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl md:text-2xl text-primary-foreground/90"
              >
                {t(`servicePages.${serviceKey}.heroSubtitle`)}
              </motion.p>
            </div>
          </div>
        </section>

        {/* Description Section */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="prose prose-lg max-w-none"
              >
                <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
                  {t(`servicePages.${serviceKey}.description`)}
                </p>
              </motion.div>

              {/* Portfolio Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-12 p-12 bg-muted/50 rounded-2xl border-2 border-dashed border-border text-center"
              >
                <p className="text-muted-foreground">
                  {language === 'ar' 
                    ? 'لا تكتفِ بسماع قصتنا، بل شاهد أعمالنا المميزة في هذا المجال'
                    : "Don't just hear our story, see our outstanding work in this field"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {language === 'ar' ? '(سيتم إضافة الأعمال قريباً)' : '(Portfolio coming soon)'}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Methodology Section */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-center mb-16"
            >
              {t(`servicePages.${serviceKey}.methodology.title`)}
            </motion.h2>

            <div className="max-w-4xl mx-auto space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1 bg-background rounded-xl p-6 shadow-sm border border-border">
                    <h3 className="text-xl font-bold mb-2">
                      {t(`servicePages.${serviceKey}.methodology.${step}.title`)}
                    </h3>
                    <p className="text-muted-foreground">
                      {t(`servicePages.${serviceKey}.methodology.${step}.description`)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="hero-section py-20">
          <div className="container-custom text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              {t('closing.title')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-primary-foreground/90 mb-8"
            >
              {t('closing.subtitle')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href="https://wa.me/966500000000"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hero-primary"
              >
                <MessageCircle className="w-5 h-5" />
                {t('common.contactUs')}
              </a>
              <button onClick={handleContactClick} className="btn-hero-secondary">
                <Phone className="w-5 h-5" />
                {t('common.bookConsultation')}
              </button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default ServicePage;
