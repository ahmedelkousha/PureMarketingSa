import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";
import logoDark from "@/assets/logo-dark.png";
import ConsultationPopup from "./ConsultationPopup";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "next-themes";

const Header = () => {
  const { t } = useTranslation();
  const { language, setLanguage, isRTL } = useLanguage();
  const { resolvedTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Check if scrolled past threshold for shadow
      setIsScrolled(currentScrollY > 10);

      // Hide on scroll down, show on scroll up
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        // Scrolling down & past header height
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // 1. Calculate the width of the scrollbar
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // 2. Add that width as padding so content doesn't shift
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      // 3. Lock scrolling
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      // Reset everything
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navItems = [
    { key: "home", path: `/${language}`, hash: "" },
    {
      key: "services",
      path: `/${language}`,
      hash: "#services",
      hasDropdown: true,
    },
    { key: "about", path: `/${language}`, hash: "#about" },
    { key: "portfolio", path: `/${language}`, hash: "#portfolio" },
    { key: "blog", path: `/${language}`, hash: "#blog" },
    { key: "contact", path: `/${language}`, hash: "#contact" },
  ];

  const isHomePage =
    location.pathname === `/${language}` ||
    location.pathname === `/${language}/`;

  const scrollToSection = (hash: string) => {
    setTimeout(() => {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleNavClick = (item: (typeof navItems)[0], closeMenu = false) => {
    if (closeMenu) {
      setIsMenuOpen(false);
    }

    // For home link without hash
    if (item.key === "home" && !item.hash) {
      if (isHomePage) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate(`/${language}`);
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
      }
      return;
    }

    if (item.hash) {
      if (isHomePage) {
        scrollToSection(item.hash);
      } else {
        navigate(`/${language}`);
        scrollToSection(item.hash);
      }
    }
  };

  const services = [
    { key: "socialMedia", slug: "social-media-management" },
    { key: "paidAds", slug: "paid-ads-campaigns" },
    { key: "motionGraphics", slug: "video-editing-motion-graphics" },
    { key: "websites", slug: "websites-ecommerce" },
  ];

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  // Hamburger menu animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
    },
    open: {
      opacity: 1,
      height: "auto",
    },
  };

  const menuItemVariants = {
    closed: { opacity: 0, x: isRTL ? 20 : -20 },
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };

  return (
    <>
      <header
        className={`rounded-b-sm fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-lg"
            : "bg-background border-b border-border"
        } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
        style={{
          boxShadow: isScrolled ? "0 4px 20px -5px rgba(0,0,0,0.15)" : "none",
        }}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to={`/${language}`}
              className="flex items-center"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <img
                src={resolvedTheme === "dark" ? logoDark : logo}
                alt="Pure Marketing"
                className="h-10 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <div key={item.key} className="relative group">
                  {item.hasDropdown ? (
                    <div className="flex items-center gap-1 cursor-pointer py-2">
                      <button
                        onClick={() => handleNavClick(item)}
                        className="text-foreground hover:text-primary transition-colors font-medium">
                        {t(`nav.${item.key}`)}
                      </button>
                      <ChevronDown
                        onClick={() => setIsServicesOpen(!isServicesOpen)}
                        className={`w-4 h-4 transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`}
                      />

                      <AnimatePresence>
                        {isServicesOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full start-0 mt-2 w-64 bg-card rounded-xl shadow-lg border border-border overflow-hidden z-50">
                            {services.map((service) => (
                              <Link
                                key={service.key}
                                to={`/${language}/services/${service.slug}`}
                                className="block px-4 py-3 hover:bg-muted transition-colors">
                                {t(`services.${service.key}.title`)}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleNavClick(item)}
                      className={`text-foreground hover:text-primary transition-colors font-medium ${
                        item.key === "home" && isHomePage ? "text-primary" : ""
                      }`}>
                      {t(`nav.${item.key}`)}
                    </button>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors">
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {language === "ar" ? "EN" : "عربي"}
                </span>
              </button>
              <Button
                variant="outline"
                onClick={() =>
                  handleNavClick({
                    key: "contact",
                    path: `/${language}`,
                    hash: "#contact",
                  })
                }>
                {t("common.contactUs")}
              </Button>
              <Button onClick={() => setIsConsultationOpen(true)}>
                {t("common.bookConsultation")}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                className="p-2 relative w-10 h-10 flex items-center justify-center"
                onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}>
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}>
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: isRTL ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? "-100%" : "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="absolute top-0 end-0 h-full w-80 max-w-[85vw] bg-background shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <Link to={`/${language}`} onClick={() => setIsMenuOpen(false)}>
                  <img
                    src={resolvedTheme === "dark" ? logoDark : logo}
                    alt="Pure Marketing"
                    className="h-8 w-auto"
                  />
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-muted rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-80px)]">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}>
                    {item.hasDropdown ? (
                      <div>
                        <div className="flex items-center">
                          <button
                            onClick={() => {
                              handleNavClick(item, true);
                            }}
                            className="flex-1 text-start px-4 py-3 text-foreground hover:bg-muted rounded-lg">
                            {t(`nav.${item.key}`)}
                          </button>
                          <button
                            onClick={() =>
                              setIsMobileServicesOpen(!isMobileServicesOpen)
                            }
                            className="p-3 hover:bg-muted rounded-lg">
                            <motion.div
                              animate={{
                                rotate: isMobileServicesOpen ? 180 : 0,
                              }}
                              transition={{ duration: 0.2 }}>
                              <ChevronDown className="w-4 h-4" />
                            </motion.div>
                          </button>
                        </div>
                        <AnimatePresence>
                          {isMobileServicesOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="ps-8 space-y-1 overflow-hidden">
                              {services.map((service) => (
                                <Link
                                  key={service.key}
                                  to={`/${language}/services/${service.slug}`}
                                  className="block px-4 py-2 text-muted-foreground hover:text-foreground"
                                  onClick={() => setIsMenuOpen(false)}>
                                  {t(`services.${service.key}.title`)}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleNavClick(item, true)}
                        className="block w-full text-start px-4 py-3 text-foreground hover:bg-muted rounded-lg">
                        {t(`nav.${item.key}`)}
                      </button>
                    )}
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                  className="flex flex-col gap-4 pt-4 border-t border-border">
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {language === "ar" ? "EN" : "عربي"}
                    </span>
                  </button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleNavClick(
                        {
                          key: "contact",
                          path: `/${language}`,
                          hash: "#contact",
                        },
                        true
                      );
                    }}>
                    {t("common.contactUs")}
                  </Button>
                  <Button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsConsultationOpen(true);
                    }}>
                    {t("common.bookConsultation")}
                  </Button>
                </motion.div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConsultationPopup
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </>
  );
};

export default Header;
