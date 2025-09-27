import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { supabase } from '../utils/supabase/client';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Shield } from 'lucide-react';

export function LoginDiagnostic() {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results: any = {
      timestamp: new Date().toISOString(),
      tests: []
    };

    try {
      // Test 1: Check Supabase configuration
      results.tests.push({
        name: 'Supabase Configuration',
        status: projectId && publicAnonKey ? 'success' : 'error',
        details: {
          projectId: projectId ? '✅ Present' : '❌ Missing',
          publicKey: publicAnonKey ? '✅ Present' : '❌ Missing',
          url: `https://${projectId}.supabase.co`
        }
      });

      // Test 2: Check server connectivity
      try {
        const healthResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-55ec1098/health`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        });
        const healthData = await healthResponse.json();
        
        results.tests.push({
          name: 'Server Connectivity',
          status: healthResponse.ok ? 'success' : 'error',
          details: {
            status: healthResponse.status,
            response: healthData
          }
        });
      } catch (error) {
        results.tests.push({
          name: 'Server Connectivity',
          status: 'error',
          details: {
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        });
      }

      // Test 3: Try to initialize admin user
      try {
        const initResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-55ec1098/init-admin`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        });
        const initData = await initResponse.json();
        
        results.tests.push({
          name: 'Admin User Initialization',
          status: initResponse.ok ? 'success' : 'warning',
          details: {
            status: initResponse.status,
            response: initData
          }
        });
      } catch (error) {
        results.tests.push({
          name: 'Admin User Initialization',
          status: 'error',
          details: {
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        });
      }

      // Test 4: Test authentication with correct credentials
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'admin@cartify.com',
          password: 'CartifySecure2024!'
        });

        results.tests.push({
          name: 'Authentication Test',
          status: data.session ? 'success' : 'error',
          details: {
            hasSession: !!data.session,
            hasUser: !!data.user,
            error: error?.message || 'None',
            email: data.user?.email || 'N/A'
          }
        });

        // Clean up test session
        if (data.session) {
          await supabase.auth.signOut();
        }
      } catch (error) {
        results.tests.push({
          name: 'Authentication Test',
          status: 'error',
          details: {
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        });
      }

      // Test 5: Check local storage
      const localToken = localStorage.getItem('cartify_admin_token');
      const localUser = localStorage.getItem('cartify_admin_user');
      
      results.tests.push({
        name: 'Local Storage Check',
        status: 'info',
        details: {
          hasToken: !!localToken,
          hasUser: !!localUser,
          tokenLength: localToken?.length || 0
        }
      });

    } catch (error) {
      results.tests.push({
        name: 'Diagnostic Error',
        status: 'error',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }

    setDiagnostics(results);
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertCircle className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      success: 'default',
      warning: 'secondary',
      error: 'destructive',
      info: 'outline'
    };
    return <Badge variant={variants[status] || 'outline'}>{status.toUpperCase()}</Badge>;
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Login Diagnostic Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runDiagnostics}
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            'Run Login Diagnostics'
          )}
        </Button>

        {diagnostics && (
          <div className="space-y-4">
            <Separator />
            <div className="text-sm text-muted-foreground">
              Test run at: {new Date(diagnostics.timestamp).toLocaleString()}
            </div>
            
            <div className="space-y-3">
              {diagnostics.tests.map((test: any, index: number) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(test.status)}
                      <span className="font-medium">{test.name}</span>
                    </div>
                    {getStatusBadge(test.status)}
                  </div>
                  
                  <div className="text-sm text-muted-foreground bg-gray-50 p-2 rounded">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(test.details, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>

            <Separator />
            
            <div className="text-sm bg-blue-50 p-3 rounded border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Recommendations:</h4>
              <ul className="text-blue-700 space-y-1">
                <li>• If Admin User Initialization shows "User already registered", try logging in directly</li>
                <li>• If Authentication Test fails, click "Initialize Admin User" on the login page</li>
                <li>• If Server Connectivity fails, check your internet connection</li>
                <li>• Clear local storage if you see stale authentication data</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
