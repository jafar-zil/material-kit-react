import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/context/AuthContext';
import { logoutUser } from 'src/services/apiService';

const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/login');
    }
  };

  return handleLogout;
};

export default useLogout;