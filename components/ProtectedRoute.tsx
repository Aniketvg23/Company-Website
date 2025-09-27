import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from './ui/card';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      // Store the intended destination
      const returnUrl = location.pathname + location.search;
      navigate('/admin/login', { 
        state: { returnUrl },
        replace: true 
      });
    }
  }, [isAuthenticated, isLoading, requireAuth, navigate, location]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div className="flex items-center space-x-3 mb-4">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-lg">Verifying Authentication...</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Please wait while we validate your session
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show unauthorized state
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto border-red-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Access Denied
            </h2>
            <p className="text-sm text-red-600 text-center mb-6">
              You need to be logged in to access this page
            </p>
            <Button 
              onClick={() => navigate('/admin/login')}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show authenticated content
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}

interface PublicRouteProps {
  children: ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  return <ProtectedRoute requireAuth={false}>{children}</ProtectedRoute>;
}
