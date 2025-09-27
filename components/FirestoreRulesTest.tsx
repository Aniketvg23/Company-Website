import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { productsService, machineryService, jobsService } from '../utils/firebase/firestore';

interface TestResult {
  service: string;
  operation: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
}

export function FirestoreRulesTest() {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setTests([
      { service: 'Products', operation: 'Read', status: 'running' },
      { service: 'Machinery', operation: 'Read', status: 'running' },
      { service: 'Jobs', operation: 'Read', status: 'running' },
    ]);

    const testServices = [
      { name: 'Products', service: productsService },
      { name: 'Machinery', service: machineryService },
      { name: 'Jobs', service: jobsService },
    ];

    const results: TestResult[] = [];

    for (const { name, service } of testServices) {
      try {
        await service.getAll();
        results.push({
          service: name,
          operation: 'Read',
          status: 'success',
          message: 'Access granted'
        });
      } catch (error: any) {
        results.push({
          service: name,
          operation: 'Read',
          status: 'error',
          message: error.code === 'permission-denied' ? 'Permission denied' : error.message
        });
      }
    }

    setTests(results);
    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'running':
        return <Badge variant="secondary">Testing...</Badge>;
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-700">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return null;
    }
  };

  const allTestsPassed = tests.length > 0 && tests.every(test => test.status === 'success');
  const hasErrors = tests.some(test => test.status === 'error');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Test Firestore Rules
        </CardTitle>
        <CardDescription>
          Test if your Firestore security rules are working correctly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runTests} disabled={isRunning}>
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Rules...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Test Firestore Access
            </>
          )}
        </Button>

        {tests.length > 0 && (
          <div className="space-y-3">
            {tests.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <div className="font-medium">{test.service} - {test.operation}</div>
                    {test.message && (
                      <div className="text-sm text-gray-600">{test.message}</div>
                    )}
                  </div>
                </div>
                {getStatusBadge(test.status)}
              </div>
            ))}
          </div>
        )}

        {allTestsPassed && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Rules Working Correctly!</AlertTitle>
            <AlertDescription className="text-green-700">
              All Firestore security rules are properly configured. Your Cartify website should now work normally.
            </AlertDescription>
          </Alert>
        )}

        {hasErrors && (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Rules Still Need Setup</AlertTitle>
            <AlertDescription className="text-red-700">
              Some services are still showing permission errors. Make sure you've published the security rules in Firebase Console.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
