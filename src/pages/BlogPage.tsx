import { useParams, Navigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Helmet } from 'react-helmet-async';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { getBlogPost } from '@/data/content';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/BackButton';

const BlogPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, isRTL } = useLanguage();
  useScrollToTop();

  const post = getBlogPost(slug || '');

  if (!post) {
    return <Navigate to={`/${language}`} replace />;
  }

  const lang = language as 'ar' | 'en';
  const title = post.title[lang] || post.title.ar;
  const content = post.content[lang] || post.content.ar;
  const author = lang === 'ar' ? 'فريق بيور ماركتنج' : 'Pure Marketing Team';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Simple markdown-like renderer
  const renderContent = (text: string) => {
    const blocks = text.split('\n\n');
    return blocks.map((block, i) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // Headings
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={i} className="text-2xl font-bold mt-10 mb-4">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }

      // Blockquote
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={i} className="border-s-4 border-primary ps-6 py-4 my-8 bg-primary/5 rounded-e-xl">
            <p className="text-lg italic text-foreground/80">{trimmed.replace('> ', '').replace(/"/g, '"')}</p>
          </blockquote>
        );
      }

      // Horizontal rule
      if (trimmed === '---') {
        return <hr key={i} className="my-8 border-border" />;
      }

      // List items
      if (trimmed.startsWith('- ') || trimmed.startsWith('1. ')) {
        const items = trimmed.split('\n').filter(l => l.trim());
        return (
          <ul key={i} className="space-y-2 my-4">
            {items.map((item, j) => (
              <li key={j} className="flex items-start gap-2 text-muted-foreground">
                <span className="text-primary mt-1">•</span>
                <span dangerouslySetInnerHTML={{ __html: formatInline(item.replace(/^[-\d.]\s*/, '')) }} />
              </li>
            ))}
          </ul>
        );
      }

      // Paragraph
      return (
        <p key={i} className="text-muted-foreground leading-relaxed mb-4"
           dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
      );
    });
  };

  const formatInline = (text: string): string => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>');
  };


  return (
    <>
      <Helmet>
        <title>{title} | Pure Marketing</title>
        <meta name="description" content={post.excerpt[lang] || post.excerpt.ar} />
        <link rel="canonical" href={`https://puremarketingsa.com/${language}/blog/${slug}`} />
        <link rel="alternate" hrefLang="ar" href={`https://puremarketingsa.com/ar/blog/${slug}`} />
        <link rel="alternate" hrefLang="en" href={`https://puremarketingsa.com/en/blog/${slug}`} />
        <link rel="alternate" hrefLang="x-default" href={`https://puremarketingsa.com/ar/blog/${slug}`} />
        <html lang={language} dir={isRTL ? 'rtl' : 'ltr'} />

        {/* Open Graph */}
        <meta property="og:title" content={`${title} | Pure Marketing`} />
        <meta property="og:description" content={post.excerpt[lang] || post.excerpt.ar} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://puremarketingsa.com/${language}/blog/${slug}`} />
        <meta property="og:image" content="https://puremarketingsa.com/og-image.png" />
        <meta property="og:site_name" content="Pure Marketing" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${title} | Pure Marketing`} />
        <meta name="twitter:description" content={post.excerpt[lang] || post.excerpt.ar} />
        <meta name="twitter:image" content="https://puremarketingsa.com/og-image.png" />
      </Helmet>

      <Header />

      <main className="pt-20">
        <div className="container-custom pt-6">
          <BackButton />
        </div>
        {/* Hero */}
        <section className="hero-section py-20 lg:py-32">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
              >
                {title}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center justify-center gap-6 text-primary-foreground/80"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.date)}
                </span>
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {author}
                </span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <article className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {renderContent(content)}

                {/* Back to blog */}
                <div className="mt-12 pt-8 border-t border-border text-center">
                  <Button asChild variant="outline" size="lg" className="gap-2">
                    <Link to={`/${language}/blog`}>
                      {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                      {isRTL ? 'العودة للمدونة' : 'Back to Blog'}
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </article>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default BlogPage;
