import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Users,
  Calendar,
  Target,
  CheckCircle,
  BarChart3,
  ZoomIn,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { caseStudyContent } from "@/data/content";
import BackButton from "@/components/BackButton";

// Campaign image imports
import campaignImage1 from "@/assets/case-study/google.png";
import campaignImage2 from "@/assets/case-study/meta.png";
import campaignImage3 from "@/assets/case-study/snapchat.png";
import campaignImage4 from "@/assets/case-study/stats.png";
import campaignImage5 from "@/assets/case-study/graph.png";

const CaseStudyPage = () => {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  useScrollToTop();

  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const content =
    caseStudyContent[language as "ar" | "en"] || caseStudyContent.ar;
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const statIcons = [TrendingUp, Calendar, Users, Target];

  const campaignImages = [
    { src: campaignImage1, alt: "Campaign Screenshot 1" },
    { src: campaignImage2, alt: "Campaign Screenshot 2" },
    { src: campaignImage3, alt: "Campaign Screenshot 3" },
    { src: campaignImage4, alt: "Campaign Screenshot 4" },
    { src: campaignImage5, alt: "Campaign Screenshot 5" },
  ];

  return (
    <>
      <Helmet>
        <title>{content.pageTitle}</title>
        <meta name="description" content={content.pageDescription} />
        <html lang={language} dir={isRTL ? 'rtl' : 'ltr'} />
      </Helmet>

      <Header />

      <main className="pt-20">
        <div className="container-custom pt-6">
          <BackButton />
        </div>
        {/* Hero Section */}
        <section className="hero-section section-padding">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto">
              <p className="text-primary-foreground/80 text-lg mb-4">
                {content.badge}
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                {content.title}
              </h1>
              <p className="text-xl text-primary-foreground/90">
                {content.client}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-background">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {content.stats.map((stat, index) => {
                const Icon = statIcons[index];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                      {stat.value}
                    </div>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto space-y-12">
              {/* About & Situation */}
              {content.sections.map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-background rounded-2xl p-8 md:p-12 shadow-lg border border-border">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </motion.div>
              ))}

              {/* Challenges */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-background rounded-2xl p-8 md:p-12 shadow-lg border border-border">
                <h2 className="text-2xl md:text-3xl font-bold mb-8">
                  {content.challengesTitle}
                </h2>
                <div className="space-y-6">
                  {content.challenges.map((challenge, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center mt-1">
                        <span className="text-destructive font-bold text-sm">
                          {i + 1}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">
                          {challenge.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {challenge.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Strategy */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-background rounded-2xl p-8 md:p-12 shadow-lg border border-border">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {content.strategyTitle}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {content.strategyIntro}
                </p>
                <div className="space-y-8">
                  {content.strategyBlocks.map((block, i) => (
                    <div key={i} className="border-s-4 border-primary ps-6">
                      <h3 className="text-xl font-bold mb-2">{block.title}</h3>
                      {block.subtitle && (
                        <p className="text-sm text-primary font-medium mb-2">
                          {block.subtitle}
                        </p>
                      )}
                      {block.content && (
                        <p className="text-muted-foreground mb-3">
                          {block.content}
                        </p>
                      )}
                      {block.items && (
                        <ul className="space-y-2">
                          {block.items.map((item, j) => (
                            <li
                              key={j}
                              className="flex items-start gap-2 text-muted-foreground">
                              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Channels */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-background rounded-2xl p-8 md:p-12 shadow-lg border border-border">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {content.channelsTitle}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {content.channelsIntro}
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {content.channels.map((ch, i) => (
                    <div key={i} className="bg-muted/50 rounded-xl p-5">
                      <h4 className="font-bold mb-2">{ch.name}</h4>
                      {ch.details && (
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {ch.details.map((d, j) => (
                            <li key={j} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Results */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-primary/5 rounded-2xl p-8 md:p-12 shadow-lg border border-primary/20">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  {content.resultsTitle}
                </h2>
                <ul className="space-y-3 mb-8">
                  {content.results.map((r, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-lg">{r}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-background rounded-xl p-6 border border-border">
                  <p className="font-bold mb-3">
                    {content.resultsFinancial.period}
                  </p>
                  <p className="text-muted-foreground">
                    {content.resultsFinancial.adSpend}
                  </p>
                  <p className="text-primary font-bold text-lg mt-1">
                    {content.resultsFinancial.revenue}
                  </p>
                  <p className="text-sm text-muted-foreground mt-3">
                    {content.resultsFinancial.platforms}
                  </p>
                </div>
              </motion.div>

              {/* Campaign Screenshots */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-background rounded-2xl p-8 md:p-12 shadow-lg border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">
                    {isRTL
                      ? "نتائج الحملات على المنصات"
                      : "Campaign Results Across Platforms"}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {campaignImages.slice(0, 4).map((image, index) => (
                    <div
                      key={index}
                      className="relative group cursor-pointer"
                      onClick={() => setLightboxImage(image.src)}>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 rounded-xl flex items-center justify-center z-[5]">
                        <div className="opacity-100 transition-opacity duration-300 bg-black rounded-full p-3 shadow-lg">
                          <ZoomIn className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <img
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        decoding="async"
                        className="w-full rounded-xl border border-border shadow-lg transition-shadow duration-300 h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                {/* 5th image — full width */}
                {campaignImages[4] && (
                  <div
                    className="relative group cursor-pointer mt-6"
                    onClick={() => setLightboxImage(campaignImages[4].src)}>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 rounded-xl flex items-center justify-center z-[5]">
                      <div className="opacity-100 transition-opacity duration-300 bg-black rounded-full p-3 shadow-lg">
                        <ZoomIn className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <img
                      src={campaignImages[4].src}
                      alt={campaignImages[4].alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full rounded-xl border border-border shadow-lg transition-shadow duration-300"
                    />
                  </div>
                )}
              </motion.div>

              {/* Conclusion */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-background rounded-2xl p-8 md:p-12 shadow-lg border border-border">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {content.conclusionTitle}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {content.conclusion}
                </p>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center">
                <h3 className="text-2xl font-bold mb-4">{content.ctaTitle}</h3>
                <p className="text-muted-foreground mb-8">
                  {content.ctaDescription}
                </p>
                <Button asChild size="lg" className="gap-2">
                  <Link to={`/${language}#contact`}>
                    {t("common.contactUs")}
                    <ArrowIcon className="w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
      <ScrollToTopButton />

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 overflow-hidden"
            onClick={() => setLightboxImage(null)}>
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <X className="w-6 h-6 text-white" />
            </button>
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              src={lightboxImage}
              alt="Fullscreen view"
              loading="lazy"
              decoding="async"
              className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CaseStudyPage;
