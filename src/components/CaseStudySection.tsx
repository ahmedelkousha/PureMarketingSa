import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import successVideo from '@/assets/success-story.mp4';

const CaseStudySection = () => {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const ref = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hasPlayed, setHasPlayed] = useState(false);
  const videoInView = useInView(videoRef, { once: true, amount: 0.5 });

  useEffect(() => {
    if (videoInView && videoRef.current && !hasPlayed) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked, user can play manually
      });
      setHasPlayed(true);
    }
  }, [videoInView, hasPlayed]);

  return (
    <section ref={ref} className="hero-section section-padding">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1">
            <p className="text-primary-foreground/80 text-lg mb-4">
              {t("caseStudy.title")}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {t("caseStudy.mainTitle")}
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              {t("caseStudy.client")}
            </p>
            <Link
              to={`/${language}/case-study`}
              className="btn-hero-primary inline-flex">
              {t("caseStudy.cta")}
              {isRTL ? (
                <ArrowLeft className="w-5 h-5" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-1 lg:order-2">
            <div className="relative aspect-video rounded-2xl overflow-hidden border-4 border-white/20">
              <video
                ref={videoRef}
                src={successVideo}
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudySection;
