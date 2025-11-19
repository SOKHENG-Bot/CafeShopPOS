import { Navigate } from 'react-router-dom';
import useUserActions from '../hooks/user.actions';

const ProtectedRoute = ({ children }) => {
  const { getAccessToken } = useUserActions();
  const token = getAccessToken();

  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
