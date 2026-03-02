import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Redirect root to Arabic by default
const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if we're at the root
    if (location.pathname === '/') {
      navigate('/ar', { replace: true });
    }
  }, [navigate, location.pathname]);

  return null;
};

export default Index;
