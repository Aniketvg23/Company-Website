import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AlertCircle, ExternalLink, CheckCircle, Copy, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function FirestoreRulesAlert() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const firestoreRules = `rules_version = '2';

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
}`;

  const copyRules = async () => {
    try {
      await navigator.clipboard.writeText(firestoreRules);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-800">
          <AlertCircle className="h-5 w-5" />
          Firestore Security Rules Required
        </CardTitle>
        <CardDescription className="text-red-700">
          Your Firebase project is connected, but Firestore security rules need to be configured to allow data access.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-800">Quick Fix Required</AlertTitle>
          <AlertDescription className="text-orange-700">
            The permission-denied errors you're seeing are normal. Follow these steps to fix them in 2 minutes.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Badge className="mt-1">1</Badge>
            <div className="flex-1">
              <h4 className="font-medium text-red-800 mb-2">Open Firebase Console</h4>
              <Button asChild size="sm" className="bg-red-600 hover:bg-red-700">
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
            <div className="flex-1">
              <h4 className="font-medium text-red-800 mb-2">Navigate to Firestore Rules</h4>
              <p className="text-sm text-red-700">
                In Firebase Console: <strong>Firestore Database</strong> → <strong>Rules</strong>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Badge className="mt-1">3</Badge>
            <div className="flex-1">
              <h4 className="font-medium text-red-800 mb-2">Copy and Paste Security Rules</h4>
              <p className="text-sm text-red-700 mb-3">
                Replace the existing rules with these Cartify-specific rules:
              </p>
              
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
                  {firestoreRules}
                </pre>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={copyRules}
                  className="absolute top-2 right-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Badge className="mt-1">4</Badge>
            <div className="flex-1">
              <h4 className="font-medium text-red-800 mb-2">Publish the Rules</h4>
              <p className="text-sm text-red-700">
                Click <strong>"Publish"</strong> in Firebase Console and wait for deployment to complete (takes ~30 seconds).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Badge className="mt-1">5</Badge>
            <div className="flex-1">
              <h4 className="font-medium text-red-800 mb-2">Refresh This Page</h4>
              <p className="text-sm text-red-700 mb-3">
                Once rules are published, refresh this page. The errors should disappear immediately.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.reload()}
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Page
              </Button>
            </div>
          </div>
        </div>

        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">What These Rules Do</AlertTitle>
          <AlertDescription className="text-green-700">
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>Allow public read access to products, machinery, and jobs</li>
              <li>Allow anyone to submit contact forms and job applications</li>
              <li>Require authentication for admin operations</li>
              <li>Secure customer data for authenticated users only</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Button 
            onClick={() => navigate('/firebase-setup')}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            Full Setup Guide
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
