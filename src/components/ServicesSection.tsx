import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Users, Megaphone, Video, Globe, ArrowRight, ArrowLeft } from 'lucide-react';

const ServicesSection = () => {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const services = [
    {
      key: 'socialMedia',
      slug: 'social-media-management',
      icon: <Users className="w-8 h-8" />,
    },
    {
      key: 'paidAds',
      slug: 'paid-ads-campaigns',
      icon: <Megaphone className="w-8 h-8" />,
    },
    {
      key: 'motionGraphics',
      slug: 'video-editing-motion-graphics',
      icon: <Video className="w-8 h-8" />,
    },
    {
      key: 'websites',
      slug: 'websites-ecommerce',
      icon: <Globe className="w-8 h-8" />,
    },
  ];

  return (
    <section id="services" ref={ref} className="section-padding bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay:0.2 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {t('services.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('services.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.key}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                to={`/${language}/services/${service.slug}`}
                className="service-card group block h-full"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {t(`services.${service.key}.title`)}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {t(`services.${service.key}.description`)}
                    </p>
                    <span className="inline-flex items-center gap-2 text-primary font-medium">
                      {t('common.learnMore')}
                      {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
