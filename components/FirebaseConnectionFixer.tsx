import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { Loader2, CheckCircle, XCircle, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { getFirebaseEnvConfig, validateFirebaseConfig, isUsingDemoConfig } from '../utils/firebase/env';
import { authService, initializeAdminUser } from '../utils/firebase/auth';
import { firebaseSetup } from '../utils/firebase/setup';

interface ConnectionTest {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
  error?: any;
}

interface FirebaseConnectionFixerProps {
  onConnectionFixed?: () => void;
}

export function FirebaseConnectionFixer({ onConnectionFixed }: FirebaseConnectionFixerProps) {
  const [tests, setTests] = useState<ConnectionTest[]>([
    { name: 'Configuration Validation', status: 'pending' },
    { name: 'Firebase Connection', status: 'pending' },
    { name: 'Authentication Service', status: 'pending' },
    { name: 'Firestore Access', status: 'pending' },
    { name: 'Admin User Setup', status: 'pending' },
  ]);
  
  const [isRunning, setIsRunning] = useState(false);
  const [showFirestoreRules, setShowFirestoreRules] = useState(false);
  const [configInfo, setConfigInfo] = useState<any>(null);

  useEffect(() => {
    // Load config info on mount
    const config = getFirebaseEnvConfig();
    const validation = validateFirebaseConfig();
    setConfigInfo({ config, validation, isDemo: isUsingDemoConfig() });
  }, []);

  const updateTest = (index: number, updates: Partial<ConnectionTest>) => {
    setTests(prev => prev.map((test, i) => i === index ? { ...test, ...updates } : test));
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    
    try {
      // Test 1: Configuration Validation
      updateTest(0, { status: 'running' });
      const validation = validateFirebaseConfig();
      if (validation.isValid) {
        updateTest(0, { status: 'success', message: 'Configuration is valid' });
      } else {
        updateTest(0, { status: 'error', message: validation.errors.join(', ') });
        setIsRunning(false);
        return;
      }

      // Test 2: Firebase Connection
      updateTest(1, { status: 'running' });
      try {
        const setupResult = await firebaseSetup.initialize();
        if (setupResult.success) {
          updateTest(1, { status: 'success', message: 'Firebase connection established' });
        } else {
          updateTest(1, { status: 'error', message: setupResult.message, error: setupResult.error });
        }
      } catch (error: any) {
        updateTest(1, { status: 'error', message: 'Firebase connection failed', error });
      }

      // Test 3: Authentication Service
      updateTest(2, { status: 'running' });
      try {
        const currentUser = authService.getCurrentUser();
        updateTest(2, { status: 'success', message: currentUser ? 'Auth service active' : 'Auth service ready' });
      } catch (error: any) {
        updateTest(2, { status: 'error', message: 'Auth service error', error });
      }

      // Test 4: Firestore Access
      updateTest(3, { status: 'running' });
      try {
        const serviceTests = await firebaseSetup.testAllServices();
        const hasErrors = serviceTests.some(result => result.status === 'error');
        
        if (hasErrors) {
          const permissionErrors = serviceTests.filter(result => 
            result.error?.code === 'permission-denied'
          );
          
          if (permissionErrors.length > 0) {
            updateTest(3, { 
              status: 'error', 
              message: `Firestore access blocked - ${permissionErrors.length} service(s) need security rules`,
              error: { needsSecurityRules: true }
            });
            setShowFirestoreRules(true);
          } else {
            updateTest(3, { status: 'error', message: 'Firestore access failed', error: serviceTests });
          }
        } else {
          updateTest(3, { status: 'success', message: 'Firestore access confirmed' });
        }
      } catch (error: any) {
        updateTest(3, { status: 'error', message: 'Firestore test failed', error });
      }

      // Test 5: Admin User Setup (DISABLED - using localStorage auth)
      updateTest(4, { status: 'running' });
      // Skip Firebase admin user initialization - using localStorage auth
      updateTest(4, { status: 'success', message: 'Admin auth using localStorage (Firebase auth disabled)' });

      // Check if all tests passed
      const allSuccess = tests.every(test => test.status === 'success');
      if (allSuccess && onConnectionFixed) {
        setTimeout(() => onConnectionFixed(), 1000);
      }

    } catch (error) {
      console.error('Diagnostic error:', error);
    }
    
    setIsRunning(false);
  };

  const getStatusIcon = (status: ConnectionTest['status']) => {
    switch (status) {
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: ConnectionTest['status']) => {
    switch (status) {
      case 'running':
        return <Badge variant="secondary">Running</Badge>;
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-700">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Firebase Connection Diagnostics
          </CardTitle>
          <CardDescription>
            Diagnose and fix Firebase connection issues for Cartify
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {configInfo && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Current Configuration</AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-1 text-sm">
                  <div>Project ID: <code>{configInfo.config.projectId}</code></div>
                  <div>Auth Domain: <code>{configInfo.config.authDomain}</code></div>
                  <div>Status: {configInfo.isDemo ? 
                    <Badge variant="outline">Demo Mode</Badge> : 
                    <Badge variant="default">Configured</Badge>
                  }</div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button onClick={runDiagnostics} disabled={isRunning}>
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Diagnostics
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Run Diagnostics
                </>
              )}
            </Button>
          </div>

          <div className="space-y-3">
            {tests.map((test, index) => (
              <div key={test.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <div className="font-medium">{test.name}</div>
                    {test.message && (
                      <div className="text-sm text-gray-600">{test.message}</div>
                    )}
                    {test.error && test.error.needsSecurityRules && (
                      <div className="text-sm text-red-600 mt-1">
                        ⚠️ Firestore security rules need to be configured
                      </div>
                    )}
                  </div>
                </div>
                {getStatusBadge(test.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showFirestoreRules && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Firestore Security Rules Required
            </CardTitle>
            <CardDescription>
              You need to configure Firestore security rules to allow access to your data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Quick Fix Required</AlertTitle>
              <AlertDescription>
                Your Firebase project is connected, but Firestore security rules are blocking access.
                Follow these steps to fix it:
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge className="mt-1">1</Badge>
                <div>
                  <div className="font-medium">Open Firebase Console</div>
                  <div className="text-sm text-gray-600 mb-2">
                    Go to your Firebase project console
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href="https://console.firebase.google.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open Firebase Console
                    </a>
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge className="mt-1">2</Badge>
                <div>
                  <div className="font-medium">Navigate to Firestore Rules</div>
                  <div className="text-sm text-gray-600">
                    Click: Firestore Database → Rules
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge className="mt-1">3</Badge>
                <div>
                  <div className="font-medium">Copy and paste these rules</div>
                  <div className="text-sm text-gray-600 mb-2">
                    Replace the existing rules with:
                  </div>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to active products, machinery, and jobs
    match /products/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /machinery/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /jobs/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Allow public write access for contact forms and job applications
    match /contacts/{document} {
      allow read, write: if request.auth != null;
      allow create: if true; // Allow anyone to submit contact forms
    }
    
    match /applications/{document} {
      allow read, write: if request.auth != null;
      allow create: if true; // Allow anyone to submit job applications
    }
    
    // Admin-only access for customers
    match /customers/{document} {
      allow read, write: if request.auth != null;
    }
  }
}`}
                  </pre>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge className="mt-1">4</Badge>
                <div>
                  <div className="font-medium">Publish the Rules</div>
                  <div className="text-sm text-gray-600">
                    Click "Publish" and wait for deployment to complete
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge className="mt-1">5</Badge>
                <div>
                  <div className="font-medium">Test Connection</div>
                  <div className="text-sm text-gray-600">
                    Come back here and run diagnostics again
                  </div>
                </div>
              </div>
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>After Setting Rules</AlertTitle>
              <AlertDescription>
                Once you've published the security rules, refresh this page and run diagnostics again.
                The connection should work immediately.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
