import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { databaseAPI } from '../utils/firebase/api';
import { initializeAdminUser } from '../utils/firebase/auth';

interface InitStatus {
  admin: 'pending' | 'success' | 'error';
  database: 'pending' | 'success' | 'error';
  message?: string;
}

export function FirebaseInitializer() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [status, setStatus] = useState<InitStatus>({
    admin: 'pending',
    database: 'pending'
  });

  const initializeFirebase = async () => {
    setIsInitializing(true);
    setStatus({ admin: 'pending', database: 'pending' });

    try {
      // Initialize admin user (DISABLED - using localStorage auth)
      setStatus(prev => ({ ...prev, admin: 'pending', message: 'Skipping Firebase admin user...' }));
      // Skip Firebase admin user initialization - using localStorage auth
      setStatus(prev => ({ ...prev, admin: 'success', message: 'Using localStorage auth (Firebase auth disabled)' }));

      // Initialize database with sample data
      setStatus(prev => ({ ...prev, database: 'pending', message: 'Setting up database...' }));
      const result = await databaseAPI.initialize();
      setStatus(prev => ({ 
        ...prev, 
        database: 'success', 
        message: `Database initialized: ${result.counts.products} products, ${result.counts.machinery} machinery, ${result.counts.jobs} jobs` 
      }));

    } catch (error) {
      console.error('Firebase initialization error:', error);
      setStatus(prev => ({ 
        ...prev, 
        admin: prev.admin === 'pending' ? 'error' : prev.admin,
        database: prev.database === 'pending' ? 'error' : prev.database,
        message: error instanceof Error ? error.message : 'Initialization failed' 
      }));
    } finally {
      setIsInitializing(false);
    }
  };

  const getStatusIcon = (state: 'pending' | 'success' | 'error') => {
    switch (state) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
  };

  const allComplete = status.admin === 'success' && status.database === 'success';
  const hasErrors = status.admin === 'error' || status.database === 'error';

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Firebase Setup
        </CardTitle>
        <CardDescription>
          Initialize Firebase authentication and database for Cartify Automotive Industries
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-medium">Admin User Setup</h4>
              <p className="text-sm text-muted-foreground">Create admin@cartify.com account</p>
            </div>
            {getStatusIcon(status.admin)}
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-medium">Database Initialization</h4>
              <p className="text-sm text-muted-foreground">Sample products, machinery, and jobs</p>
            </div>
            {getStatusIcon(status.database)}
          </div>
        </div>

        {status.message && (
          <Alert>
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}

        {allComplete && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Setup Complete!</strong> You can now login with:
              <br />
              Email: admin@cartify.com
              <br />
              Password: CartifySecure2024!
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={initializeFirebase} 
            disabled={isInitializing || allComplete}
            className="flex-1"
          >
            {isInitializing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : allComplete ? (
              'Setup Complete'
            ) : (
              'Initialize Firebase'
            )}
          </Button>

          {(allComplete || hasErrors) && (
            <Button 
              variant="outline" 
              onClick={() => setStatus({ admin: 'pending', database: 'pending', message: undefined })}
            >
              Reset
            </Button>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          <p><strong>Note:</strong> Make sure your Firebase project is configured with:</p>
          <ul className="list-disc ml-4 mt-1">
            <li>Authentication with Email/Password enabled</li>
            <li>Firestore database created</li>
            <li>Proper environment variables set</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
