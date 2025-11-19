import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function useUserActions() {
  const navigate = useNavigate();
  const baseURL = 'http://localhost:8000';

  const setUserData = (res) => {
    localStorage.setItem(
      'auth',
      JSON.stringify({
        access: res.data.access,
        refresh: res.data.refresh,
      })
    );
  };

  const login = (data) => {
    return axios.post(`${baseURL}/api/token/`, data).then((res) => {
      setUserData(res);
      navigate('/');
    });
  };

  const logout = () => {
    localStorage.removeItem('auth');
    navigate('/login');
  };

  const getAccessToken = () => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    return auth?.access;
  };

  const getRefreshToken = () => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    return auth?.refresh;
  };

  return {
    login,
    logout,
    getAccessToken,
    getRefreshToken,
  };
}

export default useUserActions;
