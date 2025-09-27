import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { supabase } from "../utils/supabase/client";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { Loader2, CheckCircle, AlertCircle, RefreshCw, User, Database, Key } from "lucide-react";

export function AuthDebugger() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    serverHealth: boolean | null;
    adminCreation: boolean | null;
    authTest: boolean | null;
    sessionTest: boolean | null;
  }>({
    serverHealth: null,
    adminCreation: null,
    authTest: null,
    sessionTest: null
  });
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testServerHealth = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-55ec1098/health`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      const result = response.ok;
      setResults(prev => ({ ...prev, serverHealth: result }));
      addLog(result ? '✅ Server health check passed' : '❌ Server health check failed');
      return result;
    } catch (error) {
      setResults(prev => ({ ...prev, serverHealth: false }));
      addLog(`❌ Server health error: ${error}`);
      return false;
    }
  };

  const testAdminCreation = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-55ec1098/init-admin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      const result = response.ok;
      setResults(prev => ({ ...prev, adminCreation: result }));
      addLog(result ? `✅ Admin creation: ${data.message}` : `❌ Admin creation failed: ${data.error}`);
      return result;
    } catch (error) {
      setResults(prev => ({ ...prev, adminCreation: false }));
      addLog(`❌ Admin creation error: ${error}`);
      return false;
    }
  };

  const testAuthentication = async () => {
    try {
      addLog('🔐 Testing authentication with secure credentials...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@cartify.com',
        password: 'CartifySecure2024!',
      });

      if (error) {
        setResults(prev => ({ ...prev, authTest: false }));
        addLog(`❌ Auth test failed: ${error.message}`);
        return false;
      }

      if (data.session?.access_token) {
        setResults(prev => ({ ...prev, authTest: true }));
        addLog('✅ Authentication successful');
        
        // Test session validity
        const { data: user, error: userError } = await supabase.auth.getUser();
        if (userError) {
          setResults(prev => ({ ...prev, sessionTest: false }));
          addLog(`❌ Session test failed: ${userError.message}`);
        } else {
          setResults(prev => ({ ...prev, sessionTest: true }));
          addLog(`✅ Session valid for user: ${user.user?.email}`);
        }
        
        // Clean up - sign out
        await supabase.auth.signOut();
        addLog('🔄 Cleaned up test session');
        
        return true;
      }

      setResults(prev => ({ ...prev, authTest: false }));
      addLog('❌ Auth test failed: No session created');
      return false;
    } catch (error) {
      setResults(prev => ({ ...prev, authTest: false }));
      addLog(`❌ Auth test error: ${error}`);
      return false;
    }
  };

  const runFullDiagnostic = async () => {
    setLoading(true);
    setLogs([]);
    setResults({ serverHealth: null, adminCreation: null, authTest: null, sessionTest: null });

    addLog('🚀 Starting comprehensive authentication diagnostic...');

    // Test 1: Server Health
    addLog('📡 Step 1: Testing server connection...');
    const serverOk = await testServerHealth();
    
    if (!serverOk) {
      addLog('❌ Cannot proceed - server is not responding');
      setLoading(false);
      return;
    }

    // Test 2: Admin Creation
    addLog('👤 Step 2: Ensuring admin user exists...');
    await testAdminCreation();
    
    // Wait for user creation to propagate
    addLog('⏳ Waiting for user creation to propagate...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Test 3: Authentication
    addLog('🔐 Step 3: Testing authentication flow...');
    const authOk = await testAuthentication();

    // Summary
    if (authOk) {
      addLog('🎉 All tests passed! Authentication is working correctly.');
      addLog('✅ You can now login with: admin@cartify.com / CartifySecure2024!');
    } else {
      addLog('⚠️ Authentication tests failed. Please check the logs above.');
    }

    setLoading(false);
  };

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse" />;
    if (status) return <CheckCircle className="w-4 h-4 text-green-600" />;
    return <AlertCircle className="w-4 h-4 text-red-600" />;
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="w-5 h-5" />
          <span>Authentication Debugger</span>
        </CardTitle>
        <CardDescription>
          Diagnose and fix authentication issues with your admin login
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              {getStatusIcon(results.serverHealth)}
              <span className="text-sm">Server Health</span>
            </div>
            <Database className="w-4 h-4 text-muted-foreground" />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              {getStatusIcon(results.adminCreation)}
              <span className="text-sm">Admin User</span>
            </div>
            <User className="w-4 h-4 text-muted-foreground" />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              {getStatusIcon(results.authTest)}
              <span className="text-sm">Authentication</span>
            </div>
            <Key className="w-4 h-4 text-muted-foreground" />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              {getStatusIcon(results.sessionTest)}
              <span className="text-sm">Session Test</span>
            </div>
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        {/* Action Button */}
        <Button 
          onClick={runFullDiagnostic}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Running Diagnostic...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Run Full Diagnostic
            </>
          )}
        </Button>

        {/* Success Alert */}
        {results.authTest && results.sessionTest && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>🎉 Authentication Working!</strong> You can now login with the admin credentials.
            </AlertDescription>
          </Alert>
        )}

        {/* Current Credentials */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Current Admin Credentials:</h4>
          <div className="space-y-1 text-sm text-blue-700 font-mono">
            <p><strong>Email:</strong> admin@cartify.com</p>
            <p><strong>Password:</strong> CartifySecure2024!</p>
          </div>
        </div>

        {/* Logs */}
        {logs.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Diagnostic Log:</h4>
            <div className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono max-h-48 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="py-0.5">{log}</div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
