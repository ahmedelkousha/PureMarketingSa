import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const BackButton = () => {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(`/${language}`);
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleBack}
      className="gap-2 mb-6 hover:bg-transparent dark:hover:bg-transparent hover:text-foreground dark:hover:text-foreground"
    >
      {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
      {isRTL ? 'العودة للصفحة السابقة' : 'Back to Previous Page'}
    </Button>
  );
};

export default BackButton;
