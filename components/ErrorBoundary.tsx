import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      // Check if this is a timeout error
      const isTimeoutError = this.state.error?.message?.includes('timed out') || 
                            this.state.error?.message?.includes('timeout');
      
      // Check if this is a Firebase error
      const isFirebaseError = this.state.error?.message?.includes('Firebase') ||
                             this.state.error?.message?.includes('permission-denied');

      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                {isTimeoutError ? 'Connection Timeout' : 'Something went wrong'}
              </CardTitle>
              <CardDescription>
                {isTimeoutError 
                  ? "The page took too long to load. This might be due to network issues or Firebase configuration problems."
                  : "An unexpected error occurred while loading this page."
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isTimeoutError && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-700">
                    <strong>Possible causes:</strong>
                    <ul className="list-disc list-inside mt-2 text-sm">
                      <li>Slow network connection</li>
                      <li>Firebase configuration issues</li>
                      <li>Firestore security rules not configured</li>
                      <li>Server overload</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {isFirebaseError && (
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    <strong>Firebase Issue:</strong> This appears to be related to Firebase setup. 
                    Check your Firebase configuration and security rules.
                  </AlertDescription>
                </Alert>
              )}

              <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded border">
                <strong>Error details:</strong>
                <p className="mt-1 font-mono text-xs break-all">
                  {this.state.error?.message || 'Unknown error'}
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={this.handleRetry} className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={this.handleGoHome}
                  className="flex-1"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {(isTimeoutError || isFirebaseError) && (
                <div className="pt-2 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('/firebase-setup', '_blank')}
                    className="w-full"
                  >
                    Firebase Setup Guide
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Simple wrapper for functional components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
