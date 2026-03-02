import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top on route change (but not on hash changes for same page)
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
};
