import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { authApi } from '../api/authApi';
import { getStoredToken, setStoredTokens, clearStoredTokens } from '../api/axiosClient';

interface AuthUser extends User {
  isEmailVerified?: boolean;
  authProvider?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrUsername: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<{ verificationToken?: string }>;
  googleLogin: (token?: string) => Promise<void>;
  appleLogin: (token?: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<{ message: string; resetToken?: string; resetUrl?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Hydrate user profile on initialization if token exists, or auto-authenticate operator
  useEffect(() => {
    const initAuth = async () => {
      let token = getStoredToken();
      if (!token) {
        try {
          const res = await authApi.login('operator', 'password123', true);
          setStoredTokens(res.tokens.access, res.tokens.refresh, true);
          setUser(res.user);
          setIsLoading(false);
          return;
        } catch (e) {
          console.warn("Auto-login operator unavailable, loading initial state", e);
        }
      } else {
        try {
          const meData = await authApi.getCurrentUser();
          setUser(meData);
        } catch {
          clearStoredTokens();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (emailOrUsername: string, password: string, rememberMe: boolean = true) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(emailOrUsername, password, rememberMe);
      setStoredTokens(res.tokens.access, res.tokens.refresh, rememberMe);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(username, email, password);
      setStoredTokens(res.tokens.access, res.tokens.refresh, true);
      setUser(res.user);
      return { verificationToken: res.verificationToken };
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (token = 'google_oauth_token_' + Date.now()) => {
    setIsLoading(true);
    try {
      const res = await authApi.googleLogin(token, 'google.operator@momentum.cyber', 'Google Operator');
      setStoredTokens(res.tokens.access, res.tokens.refresh, true);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const appleLogin = async (token = 'apple_oauth_token_' + Date.now()) => {
    setIsLoading(true);
    try {
      const res = await authApi.appleLogin(token, 'apple.operator@momentum.cyber', 'Apple Operator');
      setStoredTokens(res.tokens.access, res.tokens.refresh, true);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    return await authApi.forgotPassword(email);
  };

  const resetPassword = async (token: string, newPassword: string) => {
    await authApi.resetPassword(token, newPassword);
  };

  const verifyEmail = async (token: string) => {
    const res = await authApi.verifyEmail(token);
    if (res.isVerified && user) {
      setUser({ ...user, isEmailVerified: true });
    }
    return res.isVerified;
  };

  const logout = () => {
    clearStoredTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        googleLogin,
        appleLogin,
        forgotPassword,
        resetPassword,
        verifyEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
