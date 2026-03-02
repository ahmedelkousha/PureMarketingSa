import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { blogPosts } from '@/data/content';

const BlogSection = () => {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const lang = language as 'ar' | 'en';

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section id="blog" className="section-padding overflow-hidden">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {t('blogSection.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('blogSection.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            loop={blogPosts.length > 2}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            dir={isRTL ? 'rtl' : 'ltr'}
            key={isRTL ? 'rtl' : 'ltr'}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="blog-swiper"
          >
            {blogPosts.map((post) => (
              <SwiperSlide key={post.slug}>
                <Link
                  to={`/${language}/blog/${post.slug}`}
                  className="group block bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title[lang] || post.title.ar}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime} {t('blogSection.minRead')}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {post.title[lang] || post.title.ar}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2">
                      {post.excerpt[lang] || post.excerpt.ar}
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link to={`/${language}/blog`}>
              {t('blogSection.viewAll')}
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
