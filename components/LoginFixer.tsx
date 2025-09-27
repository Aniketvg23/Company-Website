import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { supabase } from '../utils/supabase/client';
import { CheckCircle, XCircle, RefreshCw, Wrench, AlertTriangle } from 'lucide-react';

export function LoginFixer() {
  const [isFixing, setIsFixing] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const clearLocalStorage = () => {
    localStorage.removeItem('cartify_admin_token');
    localStorage.removeItem('cartify_admin_user');
    return '✅ Cleared local storage';
  };

  const signOutSupabase = async () => {
    try {
      await supabase.auth.signOut();
      return '✅ Signed out from Supabase';
    } catch (error) {
      return `⚠️ Supabase signout warning: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  };

  const initializeAdminUser = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-55ec1098/init-admin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return `✅ Admin user initialized: ${data.message}`;
      } else {
        return `⚠️ Admin init response: ${data.error || data.message}`;
      }
    } catch (error) {
      return `❌ Failed to initialize admin user: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  };

  const testLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@cartify.com',
        password: 'CartifySecure2024!'
      });

      if (data.session && data.user) {
        // Immediately sign out to avoid side effects
        await supabase.auth.signOut();
        return '✅ Login test successful';
      } else {
        return `❌ Login test failed: ${error?.message || 'No session created'}`;
      }
    } catch (error) {
      return `❌ Login test error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  };

  const runAutoFix = async () => {
    setIsFixing(true);
    setResults([]);
    setStatus('idle');

    const steps: Array<() => Promise<string> | string> = [
      clearLocalStorage,
      signOutSupabase,
      initializeAdminUser,
      testLogin
    ];

    const stepResults: string[] = [];

    try {
      for (const step of steps) {
        const result = await step();
        stepResults.push(result);
        setResults([...stepResults]);
        
        // Add small delay between steps
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Check if all steps were successful
      const allSuccessful = stepResults.every(result => result.startsWith('✅'));
      setStatus(allSuccessful ? 'success' : 'error');

    } catch (error) {
      stepResults.push(`❌ Auto-fix error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setResults(stepResults);
      setStatus('error');
    }

    setIsFixing(false);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="w-5 h-5" />
          Auto Login Fixer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This tool will attempt to automatically fix common login issues by:
            <br />• Clearing local storage
            <br />• Signing out from Supabase
            <br />• Initializing the admin user
            <br />• Testing the login
          </AlertDescription>
        </Alert>

        <Button 
          onClick={runAutoFix}
          disabled={isFixing}
          className="w-full"
        >
          {isFixing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Running Auto Fix...
            </>
          ) : (
            'Run Auto Fix'
          )}
        </Button>

        {results.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Fix Results:</h4>
            <div className="bg-gray-50 p-3 rounded border text-sm space-y-1">
              {results.map((result, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="flex-shrink-0">
                    {result.startsWith('✅') ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : result.startsWith('❌') ? (
                      <XCircle className="w-4 h-4 text-red-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    )}
                  </span>
                  <span className="text-gray-700">{result}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {status === 'success' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-700">
              ✅ Auto-fix completed successfully! Try logging in now with:
              <br /><strong>Email:</strong> admin@cartify.com
              <br /><strong>Password:</strong> CartifySecure2024!
            </AlertDescription>
          </Alert>
        )}

        {status === 'error' && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Some issues were detected. Please check the results above and try the manual steps, or contact support if the problem persists.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
