import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function App() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth || {});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate, isAuthenticated]);

  return null;
}
