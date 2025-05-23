import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import installationService from 'services/installation';
import { shallowEqual } from 'react-redux';

export const PathLogout = ({ children }) => {
  const { user } = useSelector((state) => state.auth, shallowEqual);
  const menuActive = useSelector((list) => list.menu.activeMenu, shallowEqual);
  const navigate = useNavigate();

  useEffect(() => {
    installationService.checkInitFile().catch(() => {
      navigate('/welcome');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (user) {
    return <Navigate to={`/${menuActive ? menuActive.url : ''}`} replace />;
  }

  return children;
};
