import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../utils/supabase/client';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Check localStorage first for quick validation
      const token = localStorage.getItem('cartify_admin_token');
      const storedUser = localStorage.getItem('cartify_admin_user');
      
      if (!token || !storedUser) {
        setUser(null);
        setIsLoading(false);
        return false;
      }

      // Validate with Supabase
      const { data, error } = await supabase.auth.getUser(token);
      
      if (error || !data.user) {
        console.log('Session validation failed:', error?.message);
        // Clear invalid session
        localStorage.removeItem('cartify_admin_token');
        localStorage.removeItem('cartify_admin_user');
        setUser(null);
        setIsLoading(false);
        return false;
      }

      // Session is valid
      const userInfo: User = {
        id: data.user.id,
        email: data.user.email || '',
        user_metadata: data.user.user_metadata
      };
      
      setUser(userInfo);
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Session check failed:', err);
      // Clear session on error
      localStorage.removeItem('cartify_admin_token');
      localStorage.removeItem('cartify_admin_user');
      setUser(null);
      setIsLoading(false);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      if (!data.session?.access_token || !data.user) {
        setIsLoading(false);
        return { success: false, error: 'No session created' };
      }

      // Store session
      localStorage.setItem('cartify_admin_token', data.session.access_token);
      localStorage.setItem('cartify_admin_user', JSON.stringify(data.user));

      // Set user state
      const userInfo: User = {
        id: data.user.id,
        email: data.user.email || '',
        user_metadata: data.user.user_metadata
      };
      
      setUser(userInfo);
      setIsLoading(false);
      
      console.log('✅ Login successful for:', userInfo.email);
      return { success: true };
      
    } catch (err) {
      console.error('Login error:', err);
      setIsLoading(false);
      return { success: false, error: 'Login failed: ' + (err instanceof Error ? err.message : 'Unknown error') };
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.warn('Supabase logout error:', error.message);
      }
    } catch (err) {
      console.warn('Logout error:', err);
    } finally {
      // Always clear local session regardless of Supabase response
      localStorage.removeItem('cartify_admin_token');
      localStorage.removeItem('cartify_admin_user');
      setUser(null);
      setIsLoading(false);
      console.log('🔒 User logged out');
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
