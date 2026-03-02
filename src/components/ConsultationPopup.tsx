import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { submitContactForm } from '@/services/contactApi';

interface ConsultationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConsultationPopup = ({ isOpen, onClose }: ConsultationPopupProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    contactMethod: 'whatsapp',
    service: '',
    details: '',
  });

  const services = [
    { key: 'socialMedia', value: 'social-media' },
    { key: 'paidAds', value: 'paid-ads' },
    { key: 'motionGraphics', value: 'motion-graphics' },
    { key: 'websites', value: 'websites' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitContactForm(formData);
      toast({
        title: t('contact.successTitle'),
        description: t('contact.successMessage'),
      });
      setFormData({ name: '', phone: '', contactMethod: 'whatsapp', service: '', details: '' });
      onClose();
    } catch {
      toast({
        title: t('contact.errorTitle'),
        description: t('contact.errorMessage'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-[50%] left-[50%] !-translate-x-[50%] !-translate-y-[50%]  w-[calc(100%-2rem)] max-w-lg max-h-[calc(100vh-2rem)] bg-background rounded-2xl shadow-2xl z-[101] flex flex-col"
          >
            <div className="p-5 sm:p-6 md:p-8 overflow-y-auto flex-1">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">{t('common.bookConsultation')}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div>
                  <label className="form-label">{t('contact.name')}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required 
                  />
                </div>

                <div>
                  <label className="form-label">{t('contact.phone')}</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">{t('contact.preferredContact')}</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="whatsapp"
                        checked={formData.contactMethod === 'whatsapp'}
                        onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })}
                        className="w-4 h-4 text-primary"
                      />
                      <span>{t('contact.whatsapp')}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="phone"
                        checked={formData.contactMethod === 'phone'}
                        onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })}
                        className="w-4 h-4 text-primary"
                      />
                      <span>{t('contact.phoneCall')}</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="form-label">{t('contact.selectService')}</label>
                  <select
                    className="form-input"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    required
                  >
                    <option value="">{t('contact.selectService')}</option>
                    {services.map((service) => (
                      <option key={service.key} value={service.value}>
                        {t(`services.${service.key}.title`)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">{t('contact.details')}</label>
                  <textarea
                    className="form-input min-h-[80px] sm:min-h-[100px]"
                    placeholder={t('contact.detailsPlaceholder')}
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  {isSubmitting ? t('contact.sending') : t('contact.submit')}
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConsultationPopup;
