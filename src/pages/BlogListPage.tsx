import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Clock, Search } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useBlogs } from '@/hooks/useBlogs';
import BackButton from '@/components/BackButton';
import { Input } from '@/components/ui/input';

const BlogListPage = () => {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  useScrollToTop();
  const lang = language as 'ar' | 'en';
  const { blogs, loading } = useBlogs({ publishedOnly: true });
  const [searchQuery, setSearchQuery] = useState('');

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const filteredBlogs = blogs.filter((post) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const titleAr = (post.title?.ar || '').toLowerCase();
    const titleEn = (post.title?.en || '').toLowerCase();
    const excerptAr = (post.excerpt?.ar || '').toLowerCase();
    const excerptEn = (post.excerpt?.en || '').toLowerCase();
    return (
      titleAr.includes(query) ||
      titleEn.includes(query) ||
      excerptAr.includes(query) ||
      excerptEn.includes(query)
    );
  });

  return (
    <>
      <Helmet>
        <title>{t('blogSection.title')} | Pure Marketing</title>
        <meta name="description" content={t('blogSection.subtitle')} />
        <link rel="canonical" href={`https://puremarketingsa.com/${language}/blog`} />
        <html lang={language} dir={isRTL ? 'rtl' : 'ltr'} />
      </Helmet>

      <Header />

      <main className="pt-20">
        <div className="container-custom pt-6">
          <BackButton />
        </div>
        <section className="hero-section py-20 md:py-28">
          <div className="container-custom text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              {t('blogSection.title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8"
            >
              {t('blogSection.subtitle')}
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-md mx-auto relative"
            >
              <div className="relative">
                <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL ? 'right-4' : 'left-4'}`} />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'ar' ? 'ابحث في مقالاتنا...' : 'Search articles...'}
                  className={`bg-background/95 backdrop-blur-sm h-12 rounded-full shadow-lg border-primary/20 text-foreground ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} focus-visible:ring-primary`}
                />
              </div>
            </motion.div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom">
            {loading && blogs.length === 0 ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg">
                  {lang === 'ar' ? 'لم يتم العثور على مقالات مطابقة لبحثك' : 'No articles found matching your search.'}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogs.map((post, index) => (
                  <motion.article
                    key={post.id || post.slug}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                  >
                    <Link
                      to={`/${language}/blog/${post.slug}`}
                      className="group flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:border-primary/30 transition-all duration-300"
                    >
                      <div className="aspect-[16/10] overflow-hidden relative bg-muted">
                        <img
                          src={post.image}
                          alt={post.title[lang] || post.title.ar || ''}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span>{formatDate(post.date)}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.readTime} {t('blogSection.minRead')}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title[lang] || post.title.ar || post.title.en}
                        </h2>
                        <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed mt-auto">
                          {post.excerpt[lang] || post.excerpt.ar || post.excerpt.en}
                        </p>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default BlogListPage;
