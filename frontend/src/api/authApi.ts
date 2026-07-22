import { axiosClient } from './axiosClient';
import type { User } from '../types';

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponsePayload {
  tokens: AuthTokens;
  user: User & {
    isEmailVerified: boolean;
    authProvider: string;
  };
  verificationToken?: string;
  message?: string;
}

export const authApi = {
  login: async (email_or_username: string, password: string, remember_me: boolean = true) => {
    const response = await axiosClient.post<AuthResponsePayload>('/auth/login/', {
      email_or_username,
      password,
      remember_me,
    });
    return response.data;
  },

  register: async (username: string, email: string, password: string) => {
    const response = await axiosClient.post<AuthResponsePayload>('/auth/register/', {
      username,
      email,
      password,
    });
    return response.data;
  },

  googleLogin: async (token: string, email?: string, name?: string) => {
    const response = await axiosClient.post<AuthResponsePayload>('/auth/google/', {
      token,
      email,
      name,
    });
    return response.data;
  },

  appleLogin: async (token: string, email?: string, name?: string) => {
    const response = await axiosClient.post<AuthResponsePayload>('/auth/apple/', {
      token,
      email,
      name,
    });
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await axiosClient.post<{ message: string; resetToken?: string; resetUrl?: string }>(
      '/auth/forgot-password/',
      { email }
    );
    return response.data;
  },

  resetPassword: async (token: string, new_password: string) => {
    const response = await axiosClient.post<{ message: string }>('/auth/reset-password/', {
      token,
      new_password,
    });
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await axiosClient.post<{ message: string; isVerified: boolean }>('/auth/verify-email/', {
      token,
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axiosClient.get<User & { isEmailVerified: boolean; authProvider: string }>('/auth/me/');
    return response.data;
  },

  refreshToken: async (refresh: string) => {
    const response = await axiosClient.post<{ access: string; refresh?: string }>('/auth/token/refresh/', {
      refresh,
    });
    return response.data;
  },
};
