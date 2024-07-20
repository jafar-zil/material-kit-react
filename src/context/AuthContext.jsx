import React, { createContext, useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Initialize authenticated state based on localStorage
  const [authenticated, setAuthenticated] = useState(() => {
    const token = localStorage.getItem('authToken');
    return Boolean(token);
  });

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthenticated(false);
  };

  const contextValue = useMemo(
    () => ({
      authenticated,
      login,
      logout
    }),
    [authenticated]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  return useContext(AuthContext);
}
