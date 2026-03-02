import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { Globe, Users, Megaphone, Palette, Globe2 } from 'lucide-react';

interface StatItemProps {
  icon: React.ReactNode;
  endValue: number;
  suffix: string;
  label: string;
  delay: number;
}

const StatItem = ({ icon, endValue, suffix, label, delay }: StatItemProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = endValue / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= endValue) {
          setCount(endValue);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, endValue]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay:0.2 }}
      className="text-center"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <div className="stat-number mb-2 text-3xl xl:text-4xl">
        {count.toLocaleString()}{suffix}
      </div>
      <p className="text-muted-foreground font-medium">{label}</p>
    </motion.div>
  );
};

const StatsSection = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { icon: <Globe className="w-8 h-8" />, value: 10, suffix: '+', labelKey: 'countries' },
    { icon: <Users className="w-8 h-8" />, value: 125, suffix: '+', labelKey: 'clients' },
    { icon: <Megaphone className="w-8 h-8" />, value: 1015, suffix: '+', labelKey: 'campaigns' },
    { icon: <Palette className="w-8 h-8" />, value: 10600, suffix: '+', labelKey: 'designs' },
    { icon: <Globe2 className="w-8 h-8" />, value: 220, suffix: '+', labelKey: 'websites' },
  ];

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("stats.title")}
          </h2>
          <p className="text-lg text-muted-foreground">{t("stats.subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12 justify-items-center [&>*:last-child]:col-span-2 md:[&>*:last-child]:col-span-1">
          {stats.map((stat, index) => (
           
              <StatItem
                key={stat.labelKey}
                icon={stat.icon}
                endValue={stat.value}
                suffix={stat.suffix}
                label={t(`stats.${stat.labelKey}`)}
                delay={index * 0.1}
              />

          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
