import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthenticated(true);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthenticated(false);
  };

  const contextValue = useMemo(() => ({
    authenticated,
    login,
    logout
  }), [authenticated]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function useAuth() {
  return useContext(AuthContext);
}
