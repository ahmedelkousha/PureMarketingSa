import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Compass, Eye, Award } from 'lucide-react';

const WhyUsSection = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const reasons = [
    {
      key: 'compass',
      icon: <Compass className="w-10 h-10" />,
    },
    {
      key: 'transparency',
      icon: <Eye className="w-10 h-10" />,
    },
    {
      key: 'excellence',
      icon: <Award className="w-10 h-10" />,
    },
  ];

  return (
    <section ref={ref} className="section-padding bg-muted/30">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            {t('whyUs.title')}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.key}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary text-primary-foreground mb-6">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">
                {t(`whyUs.${reason.key}.title`)}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t(`whyUs.${reason.key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
