import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Copy, 
  CheckCircle, 
  ExternalLink, 
  Database, 
  Shield,
  AlertTriangle,
  FileText
} from "lucide-react";

export function FirestoreRulesGuide() {
  const [copied, setCopied] = useState<string | null>(null);

  const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents for testing
    // IMPORTANT: This is for development only
    match /{document=**} {
      allow read, write: if true;
    }
    
    // Production rules (commented out for setup)
    // Uncomment and customize these for production:
    /*
    // Products collection - public read, admin write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Machinery collection - public read, admin write
    match /machinery/{machineryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Jobs collection - public read, admin write
    match /jobs/{jobId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Contacts collection - allow submissions, admin read/write
    match /contacts/{contactId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    
    // Applications collection - allow submissions, admin read/write
    match /applications/{applicationId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    
    // Customers collection - admin only
    match /customers/{customerId} {
      allow read, write: if request.auth != null;
    }
    */
  }
}`;

  const productionRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products collection - public read, admin write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Machinery collection - public read, admin write
    match /machinery/{machineryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Jobs collection - public read, admin write
    match /jobs/{jobId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Contacts collection - allow submissions, admin read/write
    match /contacts/{contactId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    
    // Applications collection - allow submissions, admin read/write
    match /applications/{applicationId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    
    // Customers collection - admin only
    match /customers/{customerId} {
      allow read, write: if request.auth != null;
    }
  }
}`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="space-y-6">
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-700">
          <strong>Action Required:</strong> Your Firestore database needs security rules to allow data access. 
          Follow the steps below to configure your Firebase project.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="quick" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quick">Quick Setup</TabsTrigger>
          <TabsTrigger value="production">Production Rules</TabsTrigger>
          <TabsTrigger value="guide">Step-by-Step</TabsTrigger>
        </TabsList>

        <TabsContent value="quick" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Quick Development Setup
              </CardTitle>
              <CardDescription>
                This allows all read/write access for testing. Perfect for getting started quickly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Firestore Security Rules</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(firestoreRules, 'quick')}
                  >
                    {copied === 'quick' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copied === 'quick' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <pre className="text-xs bg-gray-100 p-3 rounded border overflow-x-auto">
                  <code>{firestoreRules}</code>
                </pre>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => window.open('https://console.firebase.google.com/project/_/firestore/rules', '_blank')}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Firebase Console
                </Button>
                <Badge variant="secondary">Recommended for testing</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="production" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                Production Security Rules
              </CardTitle>
              <CardDescription>
                More secure rules for production deployment with proper access controls.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Production Firestore Rules</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(productionRules, 'production')}
                  >
                    {copied === 'production' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copied === 'production' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <pre className="text-xs bg-gray-100 p-3 rounded border overflow-x-auto">
                  <code>{productionRules}</code>
                </pre>
              </div>

              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  <strong>Note:</strong> Production rules require Firebase Authentication for admin operations. 
                  Public users can submit contacts and applications, but only authenticated admins can manage data.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Step-by-Step Setup Guide</CardTitle>
              <CardDescription>
                Follow these steps to configure your Firebase Firestore security rules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Open Firebase Console</h4>
                    <p className="text-sm text-gray-600">Go to console.firebase.google.com and select your project</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => window.open('https://console.firebase.google.com', '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Console
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Navigate to Firestore Database</h4>
                    <p className="text-sm text-gray-600">In the left sidebar, click on "Firestore Database"</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Open Rules Tab</h4>
                    <p className="text-sm text-gray-600">Click on the "Rules" tab at the top of the Firestore page</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium">Replace the Rules</h4>
                    <p className="text-sm text-gray-600">Copy the rules from the "Quick Setup" tab and paste them, replacing the existing rules</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    5
                  </div>
                  <div>
                    <h4 className="font-medium">Publish the Rules</h4>
                    <p className="text-sm text-gray-600">Click "Publish" to apply the new security rules</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-medium">Refresh Your App</h4>
                    <p className="text-sm text-gray-600">Return to your admin dashboard and refresh the page. The permission errors should be resolved.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
