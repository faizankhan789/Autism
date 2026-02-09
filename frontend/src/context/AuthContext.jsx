import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load the current user from the backend on mount (if a token exists)
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get('/accounts/me/');
      setUser(data);
    } catch (err) {
      // Token is invalid or expired and refresh failed — clear everything
      console.error('Failed to load user:', err);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (username, password) => {
    try {
      const { data } = await api.post('/accounts/token/', { username, password });

      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      // Fetch full user profile after storing tokens
      const { data: userData } = await api.get('/accounts/me/');
      setUser(userData);

      return { success: true, user: userData };
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Login failed. Please check your credentials.';
      return { success: false, error: message };
    }
  };

  const register = async (registrationData) => {
    try {
      const { data } = await api.post('/accounts/register/', registrationData);

      // If the backend returns tokens on registration, store them
      if (data.access && data.refresh) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        const { data: userData } = await api.get('/accounts/me/');
        setUser(userData);
      }

      return { success: true, data };
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        (typeof err.response?.data === 'object'
          ? Object.values(err.response.data).flat().join(' ')
          : 'Registration failed. Please try again.');
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
