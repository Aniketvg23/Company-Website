import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { CheckCircle, AlertCircle, RefreshCw, Copy, Check, AlertTriangle } from 'lucide-react';

export function FirebaseDiagnostic() {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const { firebaseSetup } = await import('../utils/firebase/setup');
      const { authService } = await import('../utils/firebase/auth');
      
      const results = {
        timestamp: new Date().toISOString(),
        config: await checkConfig(),
        connection: await testConnection(),
        services: await firebaseSetup.testAllServices(),
        auth: await testAuth()
      };
      
      setDiagnostics(results);
    } catch (error) {
      console.error('Diagnostics failed:', error);
      setDiagnostics({
        timestamp: new Date().toISOString(),
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const checkConfig = async () => {
    try {
      const { getFirebaseEnvConfig, validateFirebaseConfig } = await import('../utils/firebase/env');
      const config = getFirebaseEnvConfig();
      const validation = validateFirebaseConfig();
      
      return {
        isValid: validation.isValid,
        errors: validation.errors,
        config: {
          hasApiKey: !!config.apiKey,
          hasProjectId: !!config.projectId,
          hasAuthDomain: !!config.authDomain,
          projectId: config.projectId
        }
      };
    } catch (error) {
      return { error: error.message };
    }
  };

  const testConnection = async () => {
    try {
      const { productsService } = await import('../utils/firebase/firestore');
      await productsService.getAll();
      return { status: 'connected', message: 'Successfully connected to Firestore' };
    } catch (error) {
      return { 
        status: 'error', 
        message: error.message,
        code: error.code,
        isPermissionError: error.code === 'permission-denied'
      };
    }
  };

  const testAuth = async () => {
    try {
      const { authService } = await import('../utils/firebase/auth');
      const currentUser = authService.getCurrentUser();
      
      return {
        hasCurrentUser: !!currentUser,
        userEmail: currentUser?.email || null
      };
    } catch (error) {
      return { error: error.message };
    }
  };

  const copyRules = () => {
    const rules = `rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
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
    
    match /contacts/{document} {
      allow read, write: if request.auth != null;
      allow create: if true;
    }
    
    match /applications/{document} {
      allow read, write: if request.auth != null;
      allow create: if true;
    }
    
    match /customers/{document} {
      allow read, write: if request.auth != null;
    }
  }
}`;

    navigator.clipboard.writeText(rules);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Firebase Diagnostics</h2>
          <p className="text-muted-foreground">Check your Firebase connection and configuration</p>
        </div>
        <Button onClick={runDiagnostics} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Run Diagnostics
        </Button>
      </div>

      {diagnostics?.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Diagnostics Failed</AlertTitle>
          <AlertDescription>{diagnostics.error}</AlertDescription>
        </Alert>
      )}

      {diagnostics && !diagnostics.error && (
        <div className="space-y-4">
          {/* Configuration Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {diagnostics.config?.isValid ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span>Status:</span>
                  <Badge variant={diagnostics.config?.isValid ? "default" : "destructive"}>
                    {diagnostics.config?.isValid ? "Valid" : "Invalid"}
                  </Badge>
                </div>
                {diagnostics.config?.config && (
                  <div className="space-y-1">
                    <div>Project ID: <code>{diagnostics.config.config.projectId}</code></div>
                    <div>API Key: {diagnostics.config.config.hasApiKey ? "✅ Set" : "❌ Missing"}</div>
                    <div>Auth Domain: {diagnostics.config.config.hasAuthDomain ? "✅ Set" : "❌ Missing"}</div>
                  </div>
                )}
                {diagnostics.config?.errors?.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium text-red-600">Issues:</p>
                    <ul className="text-sm text-red-600">
                      {diagnostics.config.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {diagnostics.connection?.status === 'connected' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                Firestore Connection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span>Status:</span>
                  <Badge variant={diagnostics.connection?.status === 'connected' ? "default" : "destructive"}>
                    {diagnostics.connection?.status === 'connected' ? "Connected" : "Error"}
                  </Badge>
                </div>
                <p className="text-sm">{diagnostics.connection?.message}</p>
                
                {diagnostics.connection?.isPermissionError && (
                  <Alert className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Permission Denied - Security Rules Required</AlertTitle>
                    <AlertDescription className="space-y-2">
                      <p>You need to set up Firestore security rules. Copy the rules below and paste them in your Firebase Console:</p>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={copyRules}>
                          {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                          {copied ? 'Copied!' : 'Copy Security Rules'}
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          Then go to Firebase Console → Firestore Database → Rules → Paste → Publish
                        </span>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Services Status */}
          <Card>
            <CardHeader>
              <CardTitle>Firebase Services</CardTitle>
              <CardDescription>Status of all Firestore collections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {diagnostics.services?.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span>{service.service}</span>
                    <Badge variant={service.status === 'connected' ? "default" : "destructive"}>
                      {service.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Auth Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {diagnostics.auth?.hasCurrentUser ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
                Authentication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span>Current User:</span>
                  <Badge variant={diagnostics.auth?.hasCurrentUser ? "default" : "secondary"}>
                    {diagnostics.auth?.hasCurrentUser ? "Signed In" : "Not Signed In"}
                  </Badge>
                </div>
                {diagnostics.auth?.userEmail && (
                  <p className="text-sm">Email: {diagnostics.auth.userEmail}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="text-center text-sm text-muted-foreground">
        Last updated: {diagnostics?.timestamp ? new Date(diagnostics.timestamp).toLocaleString() : 'Never'}
      </div>
    </div>
  );
}
