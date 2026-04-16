import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import heroDesktop from '@/assets/hero-desktop.png';
import heroMobile from '@/assets/heroMobile.png';

const HeroSection = () => {
  const { t } = useTranslation();


  return (
    <section className="hero-section relative overflow-hidden h-[calc(100vh-5rem)] min-h-[600px] flex items-center">
      {/* Background Images */}
      <img
        src={heroDesktop}
        alt=""
        className="absolute inset-0 w-full h-full object-cover hidden md:block md:object-right 2xl:object-center"
      />
      <img
        src={heroMobile}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-bottom md:hidden"
      />

      <div className={`w-full h-full relative z-10 py-10 lg:py-32 px-4 `}>
        <div className="flex flex-col h-full gap-8 justify-center lg:gap-12 items-center max-w-[22rem] lg:max-w-[60rem] xl:max-w-[70rem] sm:max-w-[30rem] md:max-w-[38rem] mx-auto">
          {/* Text Content */}

          <div className={`text-center flex flex-col md:gap-6 m-auto h-full`}>
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-[0.9rem] md:text-lg font-bold text-white/80 my-4">
                {t("hero.badge")}
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-[21px] sm:text-[28px] md:text-4xl lg:text-5xl xl:text-6xl font-extrabold lg:font-extrabold leading-[1.8] mx-[0.83em] lg:mx-[7rem] lg:leading-[72px] xl:leading-[82px] text-white whitespace-pre-line mt-8">
                {t("hero.title")}{' '}{t("hero.subTitle")}
              </motion.h2>
              {/* <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-[1.1rem] font-semibold lg:font-bold leading-[2rem] lg:leading-[4rem] md:text-2xl lg:text-5xl mb-6 text-white whitespace-pre-line">
                
              </motion.h2> */}

              {/* <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-[20px] mx-[1em] font-normal md:text-lg lg:text-4xl text-white/80 mb-7 mt-6 ">
                {t("hero.cta")}
              </motion.p> */}
            </div>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className={`flex flex-row flex-wrap-reverse w-fit mx-auto sm:flex-row gap-4 mt-12 justify-center`}>
                <a
                  href="https://api.whatsapp.com/send?phone=9660569522042"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-hero-primary px-5 text-[17px]">
                  <MessageCircle className="w-5 h-5" />
                  {t("hero.contactNow")}
                </a>
                <Link to={`tel:+966569522042`} className="btn-hero-secondary px-5 text-[17px]">
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
