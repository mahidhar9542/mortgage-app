import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '@/lib/api';

// API Response Types
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  [key: string]: any; // For additional properties
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthApiResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

interface MeResponse {
  user: User;
}

// Add _retry to AxiosRequestConfig
type AxiosRequestConfig = {
  _retry?: boolean;
  [key: string]: any; // Allow other properties
};

declare global {
  interface Window {
    _axiosPromise: any;
  }
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Verify token with backend
          const response = await api.get<ApiResponse<MeResponse>>('/auth/me');
          
          if (response.data.data?.user) {
            const userData = response.data.data.user;
            setUser(userData);
            // Update local storage with fresh user data
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            // If no user data is returned, clear the auth state
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        // Clear invalid auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post<AuthApiResponse>('/auth/signin', { 
        email: email.trim().toLowerCase(), 
        password 
      });
      
      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }
      
      // Store the token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      
      // Redirect to the dashboard or the intended page
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
      
      return user;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post<AuthApiResponse>('/auth/signup', {
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim()
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Registration failed. Please try again.');
      }
      
      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('Registration failed. Invalid response from server.');
      }
      
      // Store the token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      
      // Show success message
      window.alert('Account created successfully! Redirecting to dashboard...');
      
      // Redirect to the dashboard after successful registration
      navigate('/dashboard', { replace: true });
      
      return user;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call the logout API if needed
      await api.post('/auth/signout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear the auth token and user data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Reset the user state
      setUser(null);
      
      // Redirect to the sign-in page
      navigate('/auth/signin', { replace: true });
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
