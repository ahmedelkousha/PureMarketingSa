import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  MessageCircle,
  Phone,
  ZoomIn,
  X,
  Play,
  ExternalLink,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Helmet } from "react-helmet-async";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import BackButton from "@/components/BackButton";
import VideoCarouselSection from "@/components/VideoCarousel";
import { VideoItem } from "@/components/VideoCarousel";
import { Lightbox } from "@/components/Lightbox";
// ---------------------------------------------------------------------------
// Service slug → translation key mapping
// ---------------------------------------------------------------------------
const serviceKeys: Record<string, string> = {
  "social-media-management": "socialMedia",
  "paid-ads-campaigns": "paidAds",
  "video-editing-motion-graphics": "motionGraphics",
  "websites-ecommerce": "websites",
};

// ---------------------------------------------------------------------------
// Which service slugs show the video section instead of image carousel
// ---------------------------------------------------------------------------
const videoServices = new Set(["video-editing-motion-graphics"]);

// ---------------------------------------------------------------------------
// Gallery image imports
// Replace the placeholder paths below with your actual asset paths.
// Add or remove imports freely — just keep the gallery arrays in sync.
// ---------------------------------------------------------------------------
const motionVideos: VideoItem[] = [
  { id: 1, type: "youtube", src: "ZBdreQJEyrI", title: "" },
  { id: 2, type: "youtube", src: "Of3DLRQ8CrY", title: "" },
  { id: 3, type: "youtube", src: "k0RdQfxs7F4", title: "" },
  { id: 4, type: "youtube", src: "U1H2KdIqq34", title: "" },
  { id: 5, type: "youtube", src: "rEIqc3_mw54", title: "" },
  { id: 6, type: "youtube", src: "ZOZVXXkQ-ao", title: "" },
];

// Social Media Management gallery (n images)
import smm1 from "@/assets/smm-service/smm1.png";
import smm2 from "@/assets/smm-service/smm2.png";
import smm3 from "@/assets/smm-service/smm3.png";
import smm4 from "@/assets/smm-service/smm4.png";
import smm5 from "@/assets/smm-service/smm5.png";

// Paid Ads Campaigns gallery (n images)
import ads1 from "@/assets/ads-service/ads1.png";
import ads2 from "@/assets/ads-service/ads2.png";
import ads3 from "@/assets/ads-service/ads3.png";
import ads4 from "@/assets/ads-service/ads4.png";

// Websites & Ecommerce gallery (n images)
import ecommerce1 from "@/assets/website-ecommerce/ecommerce1.png";
import ecommerce2 from "@/assets/website-ecommerce/ecommerce2.png";
import ecommerce3 from "@/assets/website-ecommerce/ecommerce3.png";
import ecommerce4 from "@/assets/website-ecommerce/ecommerce4.png";

// ---------------------------------------------------------------------------
// Gallery arrays — add/remove items to match your imports above
// ---------------------------------------------------------------------------
const galleries: Record<
  string,
  { id: number; image: string; title: string }[]
> = {
  "social-media-management": [
    { id: 1, image: smm1, title: "Social Media 1" },
    { id: 2, image: smm2, title: "Social Media 2" },
    { id: 3, image: smm3, title: "Social Media 3" },
    { id: 4, image: smm4, title: "Social Media 4" },
    { id: 5, image: smm5, title: "Social Media 5" },
  ],
  "paid-ads-campaigns": [
    { id: 1, image: ads1, title: "Ads Campaign 1" },
    { id: 2, image: ads2, title: "Ads Campaign 2" },
    { id: 3, image: ads3, title: "Ads Campaign 3" },
    { id: 4, image: ads4, title: "Ads Campaign 4" },
  ],
  "websites-ecommerce": [
    { id: 1, image: ecommerce1, title: "Website 1" },
    { id: 2, image: ecommerce2, title: "Website 2" },
    { id: 3, image: ecommerce3, title: "Website 3" },
    { id: 4, image: ecommerce4, title: "Website 4" },
  ],
};

// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Swiper-based image carousel with lightbox zoom */
export const ImageCarousel = ({
  items,
  isRTL,
  onOpen,
}: {
  items: { id: number; image: string; title: string }[];
  isRTL: boolean;
  onOpen: (src: string) => void;
}) => (
  <Swiper
    key={isRTL ? "rtl" : "ltr"}
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
    {items.map((item) => (
      <SwiperSlide key={item.id}>
        <div
          className="relative group cursor-pointer rounded-2xl overflow-hidden bg-card border border-border"
          onClick={() => onOpen(item.image)}>
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
);


// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
const ServicePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();
  useScrollToTop();

  // Image lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const serviceKey = slug ? serviceKeys[slug] : null;

  if (!serviceKey) {
    return <Navigate to={`/${language}`} replace />;
  }

  const isVideoService = slug ? videoServices.has(slug) : false;
  const activeGallery = slug ? (galleries[slug] ?? []) : [];

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

  const steps = ["step1", "step2", "step3", "step4", "step5"];

  const handleContactClick = () => {
    navigate(`/${language}#contact`);
  };

  return (
    <>
      <Helmet>
        <title>{t(`servicePages.${serviceKey}.title`)} | Pure Marketing</title>
        <meta
          name="description"
          content={t(`servicePages.${serviceKey}.description`)}
        />
        <link
          rel="canonical"
          href={`https://puremarketing.sa/${language}/services/${slug}`}
        />
        <html lang={language} dir={isRTL ? "rtl" : "ltr"} />
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
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {t(`servicePages.${serviceKey}.title`)}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl md:text-2xl text-primary-foreground/90">
                {t(`servicePages.${serviceKey}.heroSubtitle`)}
              </motion.p>
            </div>
          </div>
        </section>

        {/* Description Section */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="prose prose-lg max-w-none mb-12">
                <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
                  {t(`servicePages.${serviceKey}.description`)}
                </p>
              </motion.div>

              {/* Portfolio heading */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {t("servicePages.portfolioTitle")}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {t(`servicePages.${serviceKey}.portfolioDesc`)}
                </p>
              </motion.div>

              {/* ── Motion Graphics: Video Carousel ───────────────────────── */}
              {isVideoService && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}>
                  <VideoCarouselSection videos={motionVideos} isRTL={isRTL} />
                </motion.div>
              )}

              {/* ── All other services: Image Carousel ────────────────────── */}
              {!isVideoService && activeGallery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-16">
                  <ImageCarousel
                    items={activeGallery}
                    isRTL={isRTL}
                    onOpen={openLightbox}
                  />
                </motion.div>
              )}

              {/* Fallback placeholder when no gallery images yet */}
              {!isVideoService && activeGallery.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-16 p-12 bg-muted/50 rounded-2xl border-2 border-dashed border-border text-center">
                  <p className="text-muted-foreground">
                    {language === "ar"
                      ? "لا تكتفِ بسماع قصتنا، بل شاهد أعمالنا المميزة في هذا المجال"
                      : "Don't just hear our story, see our outstanding work in this field"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {language === "ar"
                      ? "(سيتم إضافة الأعمال قريباً)"
                      : "(Portfolio coming soon)"}
                  </p>
                </motion.div>
              )}
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
              className="text-3xl md:text-4xl font-bold text-center mb-16">
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
                  className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1 bg-background rounded-xl p-6 shadow-sm border border-border">
                    <h3 className="text-xl font-bold mb-2">
                      {t(
                        `servicePages.${serviceKey}.methodology.${step}.title`,
                      )}
                    </h3>
                    <p className="text-muted-foreground">
                      {t(
                        `servicePages.${serviceKey}.methodology.${step}.description`,
                      )}
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
              className="text-3xl md:text-4xl font-bold mb-6">
              {t("closing.title")}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-primary-foreground/90 mb-8">
              {t("closing.subtitle")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/966500000000"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hero-primary">
                <MessageCircle className="w-5 h-5" />
                {t("common.contactUs")}
              </a>
              <button
                onClick={handleContactClick}
                className="btn-hero-secondary">
                <Phone className="w-5 h-5" />
                {t("common.bookConsultation")}
              </button>
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

export default ServicePage;
