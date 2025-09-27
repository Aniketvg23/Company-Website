import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, AlertCircle, RefreshCw, CheckCircle, Wifi, WifiOff } from 'lucide-react';

interface ResilientLoaderProps {
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  showConnectionStatus?: boolean;
}

export function ResilientLoader({ loading, error, onRetry, showConnectionStatus = true }: ResilientLoaderProps) {
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    if (onRetry) {
      onRetry();
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <h3 className="text-lg font-medium text-center mb-2">Connecting to Firebase</h3>
          <p className="text-sm text-muted-foreground text-center">
            Setting up your Cartify database connection...
          </p>
          {retryCount > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Attempt {retryCount + 1}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  // Show connection status
  if (showConnectionStatus && !loading && !error) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Connected Successfully</AlertTitle>
        <AlertDescription className="text-green-700">
          Your Cartify website is connected to Firebase and working normally.
        </AlertDescription>
      </Alert>
    );
  }

  // Show error state
  if (error) {
    const isNetworkError = error.includes('network') || error.includes('timeout') || error.includes('fetch');
    const isPermissionError = error.includes('permission-denied') || error.includes('security rules');
    const isConfigError = error.includes('API key') || error.includes('project not found');

    return (
      <Card className="w-full max-w-2xl mx-auto border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            {isNetworkError ? 'Connection Issue' : 
             isPermissionError ? 'Setup Required' : 
             isConfigError ? 'Configuration Error' : 
             'Firebase Error'}
          </CardTitle>
          <CardDescription className="text-red-700">
            {isNetworkError ? 'Unable to connect to Firebase services' :
             isPermissionError ? 'Firestore security rules need to be configured' :
             isConfigError ? 'Firebase project configuration is invalid' :
             'An error occurred while connecting to Firebase'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isOnline && (
            <Alert className="border-orange-200 bg-orange-50">
              <WifiOff className="h-4 w-4 text-orange-600" />
              <AlertTitle className="text-orange-800">Offline</AlertTitle>
              <AlertDescription className="text-orange-700">
                You appear to be offline. Please check your internet connection.
              </AlertDescription>
            </Alert>
          )}

          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Error Details</AlertTitle>
            <AlertDescription className="text-red-700">
              <code className="text-xs bg-red-100 px-2 py-1 rounded mt-1 block">
                {error}
              </code>
            </AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleRetry}
              disabled={!isOnline}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again {retryCount > 0 && `(${retryCount + 1})`}
            </Button>
            
            {(isPermissionError || isConfigError) && (
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/firebase-setup'}
                className="flex items-center gap-2"
              >
                Fix Setup
              </Button>
            )}
          </div>

          {isNetworkError && (
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Troubleshooting Steps:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Check your internet connection</li>
                <li>Try refreshing the page</li>
                <li>Check if Firebase services are operational</li>
                {retryCount > 2 && <li>Try again in a few minutes</li>}
              </ul>
            </div>
          )}

          {isPermissionError && (
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Quick Fix:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Go to Firebase Console → Firestore → Rules</li>
                <li>Copy the security rules from the setup page</li>
                <li>Publish the rules and refresh this page</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
}
