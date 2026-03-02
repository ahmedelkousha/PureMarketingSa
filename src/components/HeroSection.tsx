import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import heroDesktop from '@/assets/hero-desktop.png';
import heroMobile from '@/assets/hero-mobile.png';

const HeroSection = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <section className="hero-section relative overflow-hidden h-[calc(100vh-5rem)] min-h-[600px] flex items-center">
      {/* Background Images */}
      <img
        src={heroDesktop}
        alt=""
        className="absolute inset-0 w-full h-full object-cover hidden md:block"
      />
      <img
        src={heroMobile}
        alt=""
        className="absolute inset-0 w-full h-full object-cover md:hidden"
      />

      <div className={`container-custom w-full h-full relative z-10 py-10 lg:py-32 ${isRTL ? 'lg:mr-[10%]' : 'lg:mr-[2%]'}`}>
        <div className="flex flex-col h-full gap-8 justify-between lg:gap-12 items-center lg:items-start lg:max-w-[42rem] lg:ml-auto">
          {/* Text Content */}

          <div className={`text-center md:text-start lg:text-start flex flex-col justify-between md:justify-center md:gap-6 m-auto h-full`}>
            <div>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-base md:text-lg text-white/80 mb-4">
                {t("hero.badge")}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-[1.8rem] md:text-4xl lg:text-[2.1rem] font-extrabold leading-tight mb-6 text-white whitespace-pre-line">
                {t("hero.title")}
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-[1.1rem] md:text-2xl lg:text-[1.7rem] font-normal leading-tight mb-6 text-white whitespace-pre-line">
                {t("hero.subTitle")}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-base md:text-lg text-white/80 mb-10">
                {t("hero.cta")}
              </motion.p>
            </div>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className={`flex flex-col sm:flex-row gap-4 md:justify-start justify-center lg:justify-start`}>
                <a
                  href="https://api.whatsapp.com/send?phone=9660569522042"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-hero-primary">
                  <MessageCircle className="w-5 h-5" />
                  {t("hero.contactNow")}
                </a>
                <Link to={`tel:+966569522042`} className="btn-hero-secondary">
                  <Phone className="w-5 h-5" />
                  {t("hero.bookConsultation")}
                </Link>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
