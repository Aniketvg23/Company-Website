import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: { email: string; name: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SimpleAuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Simple auth credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@cartify.com',
  password: 'CartifyAdmin2024!',
  name: 'Admin User'
};

export function SimpleAuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = () => {
    try {
      // Check localStorage for existing auth
      const savedAuth = localStorage.getItem('cartify_admin_auth');
      if (savedAuth) {
        try {
          const authData = JSON.parse(savedAuth);
          if (authData.access_token && authData.user) {
            setIsAuthenticated(true);
            setUser({ 
              email: authData.user.email || ADMIN_CREDENTIALS.email, 
              name: ADMIN_CREDENTIALS.name 
            });
          }
        } catch (e) {
          localStorage.removeItem('cartify_admin_auth');
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simple credentials check
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      setUser({ email: ADMIN_CREDENTIALS.email, name: ADMIN_CREDENTIALS.name });
      
      // Store auth token
      localStorage.setItem('cartify_admin_auth', JSON.stringify({
        access_token: 'simple_auth_token',
        user: { email: ADMIN_CREDENTIALS.email, name: ADMIN_CREDENTIALS.name },
        timestamp: Date.now()
      }));
      
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('cartify_admin_auth');
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
