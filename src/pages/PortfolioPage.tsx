import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { VideoCarouselSection } from "@/components/VideoCarousel";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import BackButton from "@/components/BackButton";
import { VideoItem } from "@/components/VideoCarousel";
import { Lightbox } from "@/components/Lightbox";

// ---------------------------------------------------------------------------
// Gallery image imports
// ---------------------------------------------------------------------------
import smm1 from "@/assets/smm-service/smm1.png";
import smm2 from "@/assets/smm-service/smm2.png";
import smm3 from "@/assets/smm-service/smm3.png";
import smm4 from "@/assets/smm-service/smm4.png";
import smm5 from "@/assets/smm-service/smm5.png";

import ads1 from "@/assets/ads-service/ads1.png";
import ads2 from "@/assets/ads-service/ads2.png";
import ads3 from "@/assets/ads-service/ads3.png";
import ads4 from "@/assets/ads-service/ads4.png";

import ecommerce1 from "@/assets/website-ecommerce/ecommerce1.png";
import ecommerce2 from "@/assets/website-ecommerce/ecommerce2.png";
import ecommerce3 from "@/assets/website-ecommerce/ecommerce3.png";
import ecommerce4 from "@/assets/website-ecommerce/ecommerce4.png";

// ---------------------------------------------------------------------------
// Gallery data
// ---------------------------------------------------------------------------
const socialMediaGallery = [
  { id: 1, image: smm1, title: "Social Media Campaign 1" },
  { id: 2, image: smm2, title: "Social Media Campaign 2" },
  { id: 3, image: smm3, title: "Social Media Campaign 3" },
  { id: 4, image: smm4, title: "Social Media Campaign 4" },
  { id: 5, image: smm5, title: "Social Media Campaign 5" },
];

const adsGallery = [
  { id: 1, image: ads1, title: "Ads Campaign 1" },
  { id: 2, image: ads2, title: "Ads Campaign 2" },
  { id: 3, image: ads3, title: "Ads Campaign 3" },
  { id: 4, image: ads4, title: "Ads Campaign 4" },
];

const ecommerceGallery = [
  { id: 1, image: ecommerce1, title: "Website 1" },
  { id: 2, image: ecommerce2, title: "Website 2" },
  { id: 3, image: ecommerce3, title: "Website 3" },
  { id: 4, image: ecommerce4, title: "Website 4" },
];

const motionVideos: VideoItem[] = [
  { id: 1, type: "youtube", src: "ZBdreQJEyrI", title: "" },
  { id: 2, type: "youtube", src: "Of3DLRQ8CrY", title: "" },
  { id: 3, type: "youtube", src: "k0RdQfxs7F4", title: "" },
  { id: 4, type: "youtube", src: "U1H2KdIqq34", title: "" },
  { id: 5, type: "youtube", src: "rEIqc3_mw54", title: "" },
  { id: 6, type: "youtube", src: "ZOZVXXkQ-ao", title: "" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const PortfolioPage = () => {
  const { t, i18n } = useTranslation();
  const { language, isRTL } = useLanguage();
  useScrollToTop();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const openLightbox = (image: string) => {
    setLightboxImage(image);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxImage(null);
    document.body.style.overflow = "auto";
  };

  // Reusable Swiper carousel for image galleries
  const renderImageCarousel = (
    gallery: typeof socialMediaGallery,
    title: string,
  ) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-16">
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
        {title}
      </h2>
      <Swiper
        key={`${i18n.language}-${title}`}
        dir={isRTL ? "rtl" : "ltr"}
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1.5 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 2.5 },
          1280: { slidesPerView: 3 },
        }}
        className="portfolio-swiper !pb-12">
        {gallery.map((item) => (
          <SwiperSlide key={item.id}>
            <div
              className="relative group cursor-pointer rounded-2xl overflow-hidden bg-card border border-border"
              onClick={() => openLightbox(item.image)}>
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <ZoomIn className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );

  return (
    <>
      <Helmet>
        <title>{t("portfolio.title")} | Pure Marketing</title>
        <meta name="description" content={t("portfolio.subtitle")} />
        <link
          rel="canonical"
          href={`https://puremarketing.sa/${language}/portfolio`}
        />
        <html lang={language} dir={isRTL ? "rtl" : "ltr"} />
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
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {t("portfolio.title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              {t("portfolio.subtitle")}
            </motion.p>
          </div>
        </section>

        {/* Galleries */}
        <section className="section-padding">
          <div className="container-custom">
            {/* Social Media */}
            {renderImageCarousel(
              socialMediaGallery,
              isRTL
                ? "إدارة وسائل التواصل الاجتماعي"
                : "Social Media Management",
            )}

            {/* Paid Ads */}
            {renderImageCarousel(
              adsGallery,
              isRTL
                ? "الحملات الإعلانية المدفوعة"
                : "Paid Advertising Campaigns",
            )}

            {/* E-commerce */}
            {renderImageCarousel(
              ecommerceGallery,
              isRTL
                ? "المواقع والتجارة الإليكترونية"
                : "Web & E-commerce Solutions",
            )}

            {/* Motion Graphics — Video Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                {isRTL
                  ? "مونتاج الفيديو والموشن جرافيك"
                  : "Video Editing & Motion Graphics"}
              </h2>
              <VideoCarouselSection isRTL={isRTL} videos={motionVideos} />
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-2xl p-8 lg:p-12 border border-primary/30 text-center">
              <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-3">
                {isRTL
                  ? "هل أنت مستعد لاتخاذ الخطوة التالية؟"
                  : "Ready to Take the Next Step?"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                {isRTL
                  ? "حوّل رؤيتك إلى واقع بصري متكامل .. ابدأ رحلة التميز معنا اليوم واصنع لعلامتك التجارية الحضور الذي تستحقه!"
                  : "Turn your vision into a complete visual reality. Start your journey of excellence with us today and create the presence your brand deserves!"}
              </p>
              <a
                href="https://wa.me/966539959221"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary p-4 rounded-full text-primary-foreground">
                {isRTL ? "احجز استشارة مجانية" : "Book a Free Consultation"}
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />

      <Lightbox
        isOpen={lightboxOpen}
        imageSrc={lightboxImage}
        onClose={closeLightbox}
      />
    </>
  );
};

export default PortfolioPage;
