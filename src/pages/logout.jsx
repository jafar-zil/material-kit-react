import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/context/AuthContext';
import { logoutUser } from 'src/services/apiService';

const LogoutPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
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

    handleLogout();
  }, [logout, navigate]);

  return <div>Logging out...</div>; // Optional: Show a message or spinner
};

export default LogoutPage;