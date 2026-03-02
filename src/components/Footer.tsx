import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Phone, Mail, MapPin, Instagram, Twitter, Linkedin, Facebook, Youtube } from 'lucide-react';
import logoDark from '@/assets/logo-dark.png';
import { SiTiktok, SiSnapchat } from 'react-icons/si';

const Footer = () => {
  const { language, isRTL } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === `/${language}` || location.pathname === `/${language}/`;

  const quickLinks = [
    { key: 'home', hash: '' },
    { key: 'about', hash: '#about' },
    { key: 'services', hash: '#services' },
    { key: 'portfolio', hash: '#portfolio' },
    { key: 'blog', hash: '#blog' },
    { key: 'contact', hash: '#contact' },
  ];

  const services = [
    { key: 'socialMedia', slug: 'social-media-management' },
    { key: 'paidAds', slug: 'paid-ads-campaigns' },
    { key: 'websites', slug: 'websites-ecommerce' },
    { key: 'motionGraphics', slug: 'video-editing-motion-graphics' },
  ];

  const blogPosts = [
    { slug: 'digital-marketing-trends-2025' },
    { slug: 'social-media-strategy-guide' },
    { slug: 'ecommerce-success-tips' },
    { slug: 'paid-ads-optimization' },
  ];

  const socialLinks = [
    { href: 'https://instagram.com/puremarketingsa', icon: Instagram, label: 'Instagram' },
    { href: 'https://www.facebook.com/profile.php?id=61586705932748&locale=ar_AR', icon: Facebook, label: 'Facebook' },
    { href: 'https://x.com/puremarketingsa', icon: Twitter, label: 'X' },
    { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
    { href: 'https://youtube.com/@puremarketing_sa?si=Qeym4aXyIqSFZCYZ', icon: Youtube, label: 'YouTube' },
    { href: 'https://tiktok.com/@puremarketingsa', icon: SiTiktok, label: 'TikTok' },
    { href: 'https://www.snapchat.com/add/puremarketingsa', icon: SiSnapchat, label: 'Snapchat' },
  ];

  const scrollToSection = (hash: string) => {
    setTimeout(() => {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleNavClick = (hash: string) => {
    if (!hash) {
      if (isHomePage) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate(`/${language}`);
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
      }
      return;
    }

    if (isHomePage) {
      scrollToSection(hash);
    } else {
      navigate(`/${language}`);
      scrollToSection(hash);
    }
  };

  return (
    <footer className="rounded-t-sm bg-slate-900 text-white">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* About */}
          <div className="space-y-6 lg:col-span-1">
            <Link
              to={`/${language}`}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <img
                src={logoDark}
                alt="Pure Marketing"
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-white/80 leading-relaxed text-sm">
              {t("footer.aboutText")}
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-2 rounded-full bg-white/10 hover:bg-primary transition-colors">
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <div className="space-y-3">
              <a
                href="https://api.whatsapp.com/send?phone=9660569522042"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/80 hover:text-primary transition-colors text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span dir='ltr'>+966 56 952 2042</span>
              </a>
              <a
                href="mailto:info@puremarketing.sa"
                className="flex items-center gap-3 text-white/80 hover:text-primary transition-colors text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>info@puremarketing.sa</span>
              </a>
              <div className="flex items-center gap-3 text-white/80 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>
                  {language === "ar"
                    ? "المملكة العربية السعودية"
                    : "Saudi Arabia"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">{t("footer.quickLinks")}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <button
                    onClick={() => handleNavClick(link.hash)}
                    className="text-white/80 hover:text-primary transition-colors text-sm">
                    {t(`nav.${link.key}`)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Services */}
          <div>
            <h4 className="text-lg font-bold mb-6">
              {t("footer.popularServices")}
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.key}>
                  <Link
                    to={`/${language}/services/${service.slug}`}
                    className="text-white/80 hover:text-primary transition-colors text-sm">
                    {t(`services.${service.key}.title`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Blog */}
          <div>
            <h4 className="text-lg font-bold mb-6">{t("footer.blog")}</h4>
            <ul className="space-y-3">
              {blogPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    to={`/${language}/blog/${post.slug}`}
                    className="text-white/80 hover:text-primary transition-colors text-sm">
                    {t(`blogSection.posts.${post.slug}.title`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Pure */}
          <div>
            <h4 className="text-lg font-bold mb-6">{t("footer.aboutPure")}</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://drive.google.com/file/d/1ekiGHLbX8jKhTXXwfTUx88r-aDaGcwVm/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-primary transition-colors text-sm">
                  {t("footer.pureProfile")}
                </a>
              </li>
              <li>
                <a
                  href="https://drive.google.com/file/d/1YBH9WQ_bKY0JkhuDlyZp93-Inm55mwYs/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-primary transition-colors text-sm">
                  {t("footer.purePortfolio")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-white/20 text-center">
          <p className="text-white/60">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
