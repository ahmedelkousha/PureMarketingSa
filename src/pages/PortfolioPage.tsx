import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import BackButton from '@/components/BackButton';

const PortfolioPage = () => {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  useScrollToTop();

  const portfolioItems = [
    {
      key: 'project1',
      category: 'socialMedia',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop',
    },
    {
      key: 'project2',
      category: 'paidAds',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    },
    {
      key: 'project3',
      category: 'motionGraphics',
      image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop',
    },
    {
      key: 'project4',
      category: 'websites',
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop',
    },
    {
      key: 'project1',
      category: 'socialMedia',
      image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&h=600&fit=crop',
    },
    {
      key: 'project2',
      category: 'paidAds',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    },
    {
      key: 'project3',
      category: 'motionGraphics',
      image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&h=600&fit=crop',
    },
    {
      key: 'project4',
      category: 'websites',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t('portfolio.title')} | Pure Marketing</title>
        <meta name="description" content={t('portfolio.subtitle')} />
        <link rel="canonical" href={`https://puremarketing.sa/${language}/portfolio`} />
        <html lang={language} dir={isRTL ? 'rtl' : 'ltr'} />
      </Helmet>

      <Header />
      
      <main className="pt-20">
        <div className="container-custom pt-6">
          <BackButton />
        </div>
        {/* Hero */}
        <section className="hero-section py-20 md:py-28">
          <div className="container-custom text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              {t('portfolio.title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-primary-foreground/90 max-w-3xl mx-auto"
            >
              {t('portfolio.subtitle')}
            </motion.p>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {portfolioItems.map((item, index) => (
                <motion.div
                  key={`${item.key}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative overflow-hidden rounded-2xl bg-card"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={t(`portfolio.items.${item.key}.title`)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs rounded-full mb-2">
                        {t(`services.${item.category}.title`)}
                      </span>
                      <h3 className="text-lg font-bold text-background mb-1">
                        {t(`portfolio.items.${item.key}.title`)}
                      </h3>
                      <p className="text-sm text-background/80">
                        {t(`portfolio.items.${item.key}.description`)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default PortfolioPage;
