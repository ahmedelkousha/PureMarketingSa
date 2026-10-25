import { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, ArrowLeft, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Helmet } from 'react-helmet-async';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { getBlogPost } from '@/data/content';
import { getBlogPostBySlug, BlogPost } from '@/services/blogService';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/BackButton';

const BlogPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, isRTL } = useLanguage();
  useScrollToTop();

  const [post, setPost] = useState<BlogPost | null | undefined>(() => {
    if (!slug) return null;
    const staticPost = getBlogPost(slug);
    if (staticPost) {
      return {
        ...staticPost,
        id: `static-${staticPost.slug}`,
        status: 'published',
        isStatic: true,
      };
    }
    return undefined; // undefined indicates still fetching from Firebase
  });

  const [isLoading, setIsLoading] = useState<boolean>(post === undefined);

  useEffect(() => {
    if (!slug) {
      setPost(null);
      setIsLoading(false);
      return;
    }

    // Check static first
    const staticPost = getBlogPost(slug);
    if (staticPost) {
      setPost({
        ...staticPost,
        id: `static-${staticPost.slug}`,
        status: 'published',
        isStatic: true,
      });
      setIsLoading(false);
      return;
    }

    // Otherwise fetch dynamic from Firestore
    let isMounted = true;
    setIsLoading(true);

    getBlogPostBySlug(slug)
      .then((fetchedPost) => {
        if (isMounted) {
          setPost(fetchedPost);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching blog post:', err);
        if (isMounted) {
          setPost(null);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return <Navigate to={`/${language}/blog`} replace />;
  }

  const lang = language as 'ar' | 'en';
  const title = post.title?.[lang] || post.title?.ar || post.title?.en || '';
  const content = post.content?.[lang] || post.content?.ar || post.content?.en || '';
  const excerpt = post.excerpt?.[lang] || post.excerpt?.ar || post.excerpt?.en || '';
  const author = lang === 'ar' ? 'فريق بيور ماركتنج' : 'Pure Marketing Team';

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
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

  const formatInline = (text: string): string => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:text-primary/80">$1</a>');
  };

  // Markdown-like renderer
  const renderContent = (text: string) => {
    const blocks = text.split('\n\n');
    return blocks.map((block, i) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // H2 Heading
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={i} className="text-2xl md:text-3xl font-bold mt-10 mb-4 text-foreground">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }

      // H3 Heading
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={i} className="text-xl md:text-2xl font-bold mt-8 mb-3 text-foreground">
            {trimmed.replace('### ', '')}
          </h3>
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

      // Image
      const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imgMatch) {
        return (
          <figure key={i} className="my-8 rounded-2xl overflow-hidden border border-border">
            <img src={imgMatch[2]} alt={imgMatch[1]} className="w-full h-auto object-cover max-h-[500px]" />
            {imgMatch[1] && (
              <figcaption className="text-center text-xs text-muted-foreground py-2 bg-muted/30">
                {imgMatch[1]}
              </figcaption>
            )}
          </figure>
        );
      }

      // List items
      if (trimmed.startsWith('- ') || trimmed.startsWith('1. ')) {
        const items = trimmed.split('\n').filter((l) => l.trim());
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
        <p
          key={i}
          className="text-muted-foreground leading-relaxed mb-4 text-base md:text-lg"
          dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
        />
      );
    });
  };

  return (
    <>
      <Helmet>
        <title>{title} | Pure Marketing</title>
        <meta name="description" content={excerpt} />
        <link rel="canonical" href={`https://puremarketingsa.com/${language}/blog/${slug}`} />
        <link rel="alternate" hrefLang="ar" href={`https://puremarketingsa.com/ar/blog/${slug}`} />
        <link rel="alternate" hrefLang="en" href={`https://puremarketingsa.com/en/blog/${slug}`} />
        <link rel="alternate" hrefLang="x-default" href={`https://puremarketingsa.com/ar/blog/${slug}`} />
        <html lang={language} dir={isRTL ? 'rtl' : 'ltr'} />

        {/* Open Graph */}
        <meta property="og:title" content={`${title} | Pure Marketing`} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://puremarketingsa.com/${language}/blog/${slug}`} />
        <meta property="og:image" content={post.image || 'https://puremarketingsa.com/og-image.png'} />
        <meta property="og:site_name" content="Pure Marketing" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${title} | Pure Marketing`} />
        <meta name="twitter:description" content={excerpt} />
        <meta name="twitter:image" content={post.image || 'https://puremarketingsa.com/og-image.png'} />
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
