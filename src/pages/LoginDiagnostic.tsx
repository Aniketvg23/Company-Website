import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { supabase } from "../utils/supabase/client";
import { useAuth } from "../contexts/AuthContext";
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Home, Settings } from "lucide-react";

interface DiagnosticResult {
  test: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message: string;
  details?: string;
}

export function LoginDiagnostic() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [autoFixAttempted, setAutoFixAttempted] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  const addResult = (result: DiagnosticResult) => {
    setResults(prev => [...prev, result]);
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);
    
    try {
      // Test 1: Check Supabase Configuration
      addResult({
        test: "Supabase Configuration",
        status: 'pending',
        message: "Checking Supabase connection..."
      });

      try {
        const healthResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-55ec1098/health`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });
        
        if (healthResponse.ok) {
          addResult({
            test: "Supabase Configuration",
            status: 'pass',
            message: "Supabase connection successful",
            details: `Project ID: ${projectId}`
          });
        } else {
          addResult({
            test: "Supabase Configuration",
            status: 'fail',
            message: "Supabase server not responding",
            details: `Status: ${healthResponse.status}`
          });
        }
      } catch (error) {
        addResult({
          test: "Supabase Configuration",
          status: 'fail',
          message: "Failed to connect to Supabase",
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Test 2: Check Admin User Existence
      addResult({
        test: "Admin User Check",
        status: 'pending',
        message: "Checking if admin user exists..."
      });

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'admin@cartify.com',
          password: 'CartifySecure2024!'
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            addResult({
              test: "Admin User Check",
              status: 'fail',
              message: "Admin user does not exist",
              details: "Need to initialize admin user"
            });
          } else {
            addResult({
              test: "Admin User Check",
              status: 'fail',
              message: "Login error occurred",
              details: error.message
            });
          }
        } else {
          addResult({
            test: "Admin User Check",
            status: 'pass',
            message: "Admin user exists and credentials are valid",
            details: `User ID: ${data.user?.id}`
          });
          // Sign out immediately after test
          await supabase.auth.signOut();
        }
      } catch (error) {
        addResult({
          test: "Admin User Check",
          status: 'fail',
          message: "Failed to test admin credentials",
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Test 3: Check AuthContext Status
      addResult({
        test: "AuthContext Status",
        status: isAuthenticated ? 'pass' : 'warning',
        message: isAuthenticated ? "User is authenticated" : "User not authenticated",
        details: `Loading: ${isLoading}, User: ${user?.email || 'None'}`
      });

      // Test 4: Test Server Admin Initialization
      addResult({
        test: "Server Admin Initialization",
        status: 'pending',
        message: "Testing admin initialization endpoint..."
      });

      try {
        const initResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-55ec1098/init-admin`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        });

        const initResult = await initResponse.json();
        
        if (initResponse.ok) {
          addResult({
            test: "Server Admin Initialization",
            status: 'pass',
            message: "Admin initialization endpoint working",
            details: initResult.message || 'Success'
          });
        } else {
          addResult({
            test: "Server Admin Initialization",
            status: 'fail',
            message: "Admin initialization failed",
            details: initResult.error || `Status: ${initResponse.status}`
          });
        }
      } catch (error) {
        addResult({
          test: "Server Admin Initialization",
          status: 'fail',
          message: "Failed to reach initialization endpoint",
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Test 5: Local Storage Check
      const token = localStorage.getItem('cartify_admin_token');
      const storedUser = localStorage.getItem('cartify_admin_user');
      
      addResult({
        test: "Local Storage",
        status: token && storedUser ? 'pass' : 'warning',
        message: token && storedUser ? "Session data found in storage" : "No session data in storage",
        details: `Token: ${token ? 'Present' : 'Missing'}, User: ${storedUser ? 'Present' : 'Missing'}`
      });

    } catch (error) {
      addResult({
        test: "Diagnostic Error",
        status: 'fail',
        message: "Diagnostic process failed",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const autoFix = async () => {
    setAutoFixAttempted(true);
    
    try {
      // Clear any existing sessions
      localStorage.removeItem('cartify_admin_token');
      localStorage.removeItem('cartify_admin_user');
      await supabase.auth.signOut();
      
      // Initialize admin user
      const initResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-55ec1098/init-admin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (initResponse.ok) {
        // Wait a moment for user creation to propagate
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Run diagnostics again
        await runDiagnostics();
      }
    } catch (error) {
      console.error('Auto-fix failed:', error);
    }
  };

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'pending':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
    }
  };

  const getStatusBadge = (status: DiagnosticResult['status']) => {
    const colors = {
      pass: 'bg-green-100 text-green-800',
      fail: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <Badge className={colors[status]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const failedTests = results.filter(r => r.status === 'fail').length;
  const warningTests = results.filter(r => r.status === 'warning').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-primary"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/login')}
            className="text-primary border-primary hover:bg-primary hover:text-white"
          >
            <Settings className="w-4 h-4 mr-2" />
            Go to Login
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Login System Diagnostic</CardTitle>
            <CardDescription>
              Comprehensive analysis of your authentication system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button 
                onClick={runDiagnostics} 
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
                {isRunning ? 'Running...' : 'Run Diagnostics'}
              </Button>
              
              {failedTests > 0 && (
                <Button 
                  onClick={autoFix} 
                  disabled={isRunning || autoFixAttempted}
                  variant="outline"
                  className="flex items-center gap-2 text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                >
                  <Settings className="w-4 h-4" />
                  Auto Fix Issues
                </Button>
              )}
            </div>

            {failedTests > 0 && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Found {failedTests} critical issue{failedTests > 1 ? 's' : ''} that need attention.
                </AlertDescription>
              </Alert>
            )}

            {warningTests > 0 && failedTests === 0 && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Found {warningTests} warning{warningTests > 1 ? 's' : ''} that may need attention.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Diagnostic Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{result.test}</h4>
                      {getStatusBadge(result.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{result.message}</p>
                    {result.details && (
                      <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                        {result.details}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              
              {results.length === 0 && !isRunning && (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No diagnostic results yet. Click "Run Diagnostics" to start.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {autoFixAttempted && (
          <Alert className="mt-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Auto-fix completed. Please try logging in again at <strong>/admin/login</strong>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
