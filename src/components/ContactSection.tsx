import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Send, MessageCircle, Phone, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { submitContactForm } from "@/services/contactApi";

const ContactSection = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    contactMethod: "whatsapp",
    service: "",
    details: "",
  });

  const services = [
    { key: "socialMedia", value: "social-media" },
    { key: "paidAds", value: "paid-ads" },
    { key: "motionGraphics", value: "motion-graphics" },
    { key: "websites", value: "websites" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await submitContactForm(formData);
      if (!result.success) throw new Error("Submission failed");
      
      toast({
        title: t("contact.successTitle"),
        description: t("contact.successMessage"),
      });
      setFormData({ name: "", phone: "", contactMethod: "whatsapp", service: "", details: "" });
    } catch {
      toast({
        title: t("contact.errorTitle"),
        description: t("contact.errorMessage"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" ref={ref} className="section-padding bg-muted/30">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
              {t("closing.title")}
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground">
              {t("closing.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="https://api.whatsapp.com/send?phone=9660569522042"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1">
                <Button size="lg" className="w-full gap-2">
                  <MessageCircle className="w-5 h-5" />
                  {t("common.contactUs")}
                </Button>
              </a>
              <a href="tel:+966569522042" className="flex-1">
                <Button size="lg" variant="outline" className="w-full gap-2">
                  <Phone className="w-5 h-5" />
                  {t("common.bookConsultation")}
                </Button>
              </a>
            </div>

            {/* <div className="flex items-start gap-4 p-4 sm:p-6 rounded-xl bg-background border border-border">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-primary flex-shrink-0" />
              <div>
                <p className="text-foreground leading-relaxed text-sm sm:text-base">
                  {t("closing.licensed")}
                </p>
              </div>
            </div> */}
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.4 }}>
            <div className="bg-background rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-border">
              <h3 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6">
                {t("contact.title")}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="form-label">{t("contact.name")}</label>
                  <input
                    type="text"
                    className="form-input focus:bg-slate-300/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-0 transition-colors"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="form-label">{t("contact.phone")}</label>
                  <input
                    type="tel"
                    className="form-input focus:bg-slate-300/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-0 transition-colors"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="form-label">
                    {t("contact.preferredContact")}
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="whatsapp"
                        checked={formData.contactMethod === "whatsapp"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactMethod: e.target.value,
                          })
                        }
                        className="w-4 h-4 text-primary "
                      />
                      <span className="text-sm sm:text-base">
                        {t("contact.whatsapp")}
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="phone"
                        checked={formData.contactMethod === "phone"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactMethod: e.target.value,
                          })
                        }
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm sm:text-base">
                        {t("contact.phoneCall")}
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="form-label">
                    {t("contact.selectService")}
                  </label>
                  <select
                    className="form-input focus:bg-slate-300/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-0 transition-colors"
                    value={formData.service}
                    onChange={(e) =>
                      setFormData({ ...formData, service: e.target.value })
                    }
                    required>
                    <option value="">{t("contact.selectService")}</option>
                    {services.map((service) => (
                      <option key={service.key} value={t(`services.${service.key}.title`)}>
                        {t(`services.${service.key}.title`)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">{t("contact.details")}</label>
                  <textarea
                    className="form-input min-h-[100px] sm:min-h-[120px] focus:bg-slate-300/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-0 transition-colors"
                    placeholder={t("contact.detailsPlaceholder")}
                    value={formData.details}
                    onChange={(e) =>
                      setFormData({ ...formData, details: e.target.value })
                    }
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2"
                  disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  {isSubmitting ? t("contact.sending") : t("contact.submit")}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
