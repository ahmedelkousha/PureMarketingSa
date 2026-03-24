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

      <div className={`w-full h-full relative z-10 py-10 lg:py-32 px-4 `}>
        <div className="flex flex-col h-full gap-8 justify-center lg:gap-12 items-center lg:max-w-[60rem] lg:mx-auto">
          {/* Text Content */}

          <div className={`text-center flex flex-col md:gap-6 m-auto h-full`}>
            <div>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-[0.9rem] md:text-lg font-bold text-white/80 mb-4">
                {t("hero.badge")}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-[1.2rem] md:text-4xl lg:text-5xl font-semibold lg:font-bold leading-[2rem] lg:leading-[4rem] text-white whitespace-pre-line">
                {t("hero.title")}
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-[1.1rem] font-semibold lg:font-bold leading-[2rem] lg:leading-[4rem] md:text-2xl lg:text-5xl mb-6 text-white whitespace-pre-line">
                {t("hero.subTitle")}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-[1rem] md:text-lg lg:text-4xl text-white/80 mb-6">
                {t("hero.cta")}
              </motion.p>
            </div>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className={`flex flex-row sm:flex-row gap-4 justify-center`}>
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
