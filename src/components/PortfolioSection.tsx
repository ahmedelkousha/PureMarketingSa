import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion,AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft,X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { ImageCarousel } from '@/pages/ServicePage';

import 'swiper/css';
import 'swiper/css/navigation';

// Social Media Management gallery (n images)
import smm1 from "@/assets/smm-service/smm1.png";
import smm2 from "@/assets/smm-service/smm2.png";
import smm3 from "@/assets/smm-service/smm3.png";
import smm4 from "@/assets/smm-service/smm4.png";
import smm5 from "@/assets/smm-service/smm5.png";

import ecommerce1 from "@/assets/website-ecommerce/ecommerce1.png";
import ecommerce2 from "@/assets/website-ecommerce/ecommerce2.png";
import ecommerce3 from "@/assets/website-ecommerce/ecommerce3.png";
import ecommerce4 from "@/assets/website-ecommerce/ecommerce4.png";
import { useState } from 'react';
  
const galleries: Record<
  string,
  { id: number; image: string; title: string }[]
> = {
  socialMedia: [
    { id: 1, image: smm1, title: "Social Media 1" },
    { id: 2, image: smm2, title: "Social Media 2" },
    { id: 3, image: smm3, title: "Social Media 3" },
    { id: 4, image: smm4, title: "Social Media 4" },
    { id: 5, image: smm5, title: "Social Media 5" },
  ],
  ecommerce: [
    { id: 1, image: ecommerce1, title: "Website 1" },
    { id: 2, image: ecommerce2, title: "Website 2" },
    { id: 3, image: ecommerce3, title: "Website 3" },
    { id: 4, image: ecommerce4, title: "Website 4" },
  ],
};

const PortfolioSection = () => {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
 const [lightboxOpen, setLightboxOpen] = useState(false);
 const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

 const openLightbox = (src: string) => {
   setLightboxImage(src);
   setLightboxOpen(true);
   document.body.style.overflow = "hidden";
 };

 const closeLightbox = () => {
   setLightboxOpen(false);
   setLightboxImage(null);
   document.body.style.overflow = "auto";
 };
  return (
    <section
      id="portfolio"
      className="section-padding bg-muted/30 overflow-hidden">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {t("portfolio.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t("portfolio.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12">
          <ImageCarousel items={galleries.socialMedia} isRTL={isRTL} onOpen={openLightbox} />
          <ImageCarousel items={galleries.ecommerce} isRTL={isRTL} onOpen={openLightbox} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center">
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link to={`/${language}/portfolio`}>
              {t("portfolio.viewAll")}
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95"
            onClick={closeLightbox}>
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-10 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
              <X className="w-8 h-8 text-white" />
            </button>
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
              <img
                src={lightboxImage}
                alt="Fullscreen view"
                loading="lazy"
                decoding="async"
                className="max-w-full max-h-full object-contain"
                draggable={false}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PortfolioSection;
