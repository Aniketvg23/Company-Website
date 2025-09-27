import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2, 
  RefreshCw,
  Database,
  Shield,
  ExternalLink
} from "lucide-react";

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: string;
}

export function FirebaseConnectionTest() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const tests = [
    { name: 'Firebase Configuration', key: 'config' },
    { name: 'Firestore Connection', key: 'connection' },
    { name: 'Products Collection', key: 'products' },
    { name: 'Machinery Collection', key: 'machinery' },
    { name: 'Jobs Collection', key: 'jobs' },
    { name: 'Contacts Collection', key: 'contacts' },
    { name: 'Applications Collection', key: 'applications' },
  ];

  const runTests = async () => {
    setTesting(true);
    
    // Initialize results
    const initialResults: TestResult[] = tests.map(test => ({
      name: test.name,
      status: 'pending',
      message: 'Testing...'
    }));
    setResults(initialResults);

    try {
      // Test Firebase configuration
      await testConfiguration();
      
      // Test Firestore connection
      await testConnection();
      
      // Test each collection
      await testCollection('products');
      await testCollection('machinery');
      await testCollection('jobs');
      await testCollection('contacts');
      await testCollection('applications');
      
    } catch (error) {
      console.error('Test suite failed:', error);
    } finally {
      setTesting(false);
    }
  };

  const updateResult = (name: string, status: TestResult['status'], message: string, details?: string) => {
    setResults(prev => prev.map(result => 
      result.name === name 
        ? { ...result, status, message, details }
        : result
    ));
  };

  const testConfiguration = async () => {
    try {
      const { isUsingDemoConfig } = await import('../utils/firebase/env');
      
      if (isUsingDemoConfig()) {
        updateResult('Firebase Configuration', 'error', 
          'Demo configuration detected', 
          'Please set up your Firebase project credentials'
        );
      } else {
        updateResult('Firebase Configuration', 'success', 'Valid configuration found');
      }
    } catch (error) {
      updateResult('Firebase Configuration', 'error', 
        'Configuration error', 
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  };

  const testConnection = async () => {
    try {
      const { db } = await import('../utils/firebase/config');
      
      if (db) {
        updateResult('Firestore Connection', 'success', 'Connected to Firestore');
      } else {
        updateResult('Firestore Connection', 'error', 'Failed to connect to Firestore');
      }
    } catch (error) {
      updateResult('Firestore Connection', 'error', 
        'Connection failed', 
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  };

  const testCollection = async (collectionName: string) => {
    try {
      const { collection, getDocs } = await import('firebase/firestore');
      const { db } = await import('../utils/firebase/config');
      
      const testCollection = collection(db, collectionName);
      await getDocs(testCollection);
      
      updateResult(`${capitalizeFirst(collectionName)} Collection`, 'success', 
        'Collection accessible'
      );
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        updateResult(`${capitalizeFirst(collectionName)} Collection`, 'error', 
          'Permission denied', 
          'Firestore security rules need to be configured'
        );
      } else {
        updateResult(`${capitalizeFirst(collectionName)} Collection`, 'error', 
          'Access failed', 
          error.message || 'Unknown error'
        );
      }
    }
  };

  const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Passed</Badge>;
      case 'error':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">Testing</Badge>;
    }
  };

  const hasPermissionErrors = results.some(result => 
    result.status === 'error' && result.details?.includes('security rules')
  );

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  useEffect(() => {
    // Run tests automatically on component mount
    runTests();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            Firebase Connection Test
          </CardTitle>
          <CardDescription>
            Comprehensive test of your Firebase setup and Firestore access permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Status: {successCount} passed, {errorCount} failed
              </div>
              {testing && (
                <div className="flex items-center gap-2 text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Running tests...</span>
                </div>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={runTests}
              disabled={testing}
            >
              {testing ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {testing ? 'Testing...' : 'Run Tests'}
            </Button>
          </div>

          <Separator />

          <div className="space-y-3">
            {results.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm text-gray-600">{result.message}</div>
                    {result.details && (
                      <div className="text-xs text-gray-500 mt-1">{result.details}</div>
                    )}
                  </div>
                </div>
                {getStatusBadge(result.status)}
              </div>
            ))}
          </div>

          {hasPermissionErrors && (
            <Alert className="border-orange-200 bg-orange-50">
              <Shield className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-700">
                <strong>Permission Errors Detected:</strong> Your Firebase project is connected, but Firestore security rules need to be configured. 
                This is normal for new projects.
                <div className="flex gap-2 mt-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open('/firebase-setup', '_blank')}
                    className="border-orange-300 text-orange-700 hover:bg-orange-100"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Setup Security Rules
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open('https://console.firebase.google.com/project/_/firestore/rules', '_blank')}
                    className="border-orange-300 text-orange-700 hover:bg-orange-100"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Firebase Console
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
