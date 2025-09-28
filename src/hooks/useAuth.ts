import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      const username = localStorage.getItem('username');
      
      if (token && username) {
        // Verify token is still valid by making a simple API call
        try {
          // !!! Remember this later to make api calls here
          // For now, this will set the user if token exists
          setUser({ id: 1, username });
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('username');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (accessToken: string, refreshToken: string, username: string) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('username', username);
    setUser({ id: 1, username });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('access_token');
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
  };
};