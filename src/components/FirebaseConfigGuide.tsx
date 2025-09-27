import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { CheckCircle, AlertCircle, ExternalLink, Copy, Check } from 'lucide-react';
import { isUsingDemoConfig, validateFirebaseConfig } from '../utils/firebase/env';
import { FirebaseConfigForm } from './FirebaseConfigForm';

export function FirebaseConfigGuide() {
  const [copied, setCopied] = useState(false);
  const isDemoConfig = isUsingDemoConfig();
  const validation = validateFirebaseConfig();

  const configTemplate = `// Firebase Configuration for Cartify Automotive Industries
export const DEV_FIREBASE_CONFIG = {
  apiKey: "YOUR_FIREBASE_API_KEY_HERE",
  authDomain: "cartify-automotive.firebaseapp.com",
  projectId: "cartify-automotive",
  storageBucket: "cartify-automotive.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID",
};`;

  const copyConfig = () => {
    navigator.clipboard.writeText(configTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="mb-2">🔥 Firebase Setup for Cartify</h1>
        <p className="text-muted-foreground">
          Configure your Firebase project to enable the backend functionality
        </p>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {validation.isValid ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
            Current Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span>Configuration:</span>
              <Badge variant={validation.isValid ? "default" : "destructive"}>
                {validation.isValid ? "Ready" : "Needs Setup"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span>Demo Mode:</span>
              <Badge variant={isDemoConfig ? "secondary" : "default"}>
                {isDemoConfig ? "Active" : "Disabled"}
              </Badge>
            </div>
            {validation.errors.length > 0 && (
              <div className="mt-4">
                <p className="font-medium text-red-600 mb-2">Issues Found:</p>
                <ul className="space-y-1">
                  {validation.errors.map((error, index) => (
                    <li key={index} className="text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Setup Steps */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Firebase Setup Steps</CardTitle>
          <CardDescription>
            Follow these steps to set up your Firebase project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1 */}
          <div className="border-l-2 border-primary pl-4">
            <h3 className="font-medium flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm">1</span>
              Create Firebase Project
            </h3>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Create a new Firebase project or use an existing one
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://console.firebase.google.com/', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Firebase Console
            </Button>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <div>• Click "Create a project" or select existing project</div>
              <div>• Name it "cartify-automotive" (recommended)</div>
              <div>• Enable Google Analytics (optional)</div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="border-l-2 border-primary pl-4">
            <h3 className="font-medium flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm">2</span>
              Add Web App
            </h3>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Register your web application with Firebase
            </p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>• Go to Project Settings → General</div>
              <div>• Click "Add app" → Web icon (&lt;/&gt;)</div>
              <div>• Name: "Cartify Website"</div>
              <div>• Check "Also set up Firebase Hosting" (optional)</div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="border-l-2 border-primary pl-4">
            <h3 className="font-medium flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm">3</span>
              Enable Required Services
            </h3>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Enable Firestore Database and Authentication
            </p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>• <strong>Firestore Database:</strong> Build → Firestore Database → Create database</div>
              <div>• Start in production mode → Choose region</div>
              <div>• <strong>Authentication:</strong> Build → Authentication → Get started</div>
              <div>• Enable Email/Password provider</div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="border-l-2 border-primary pl-4">
            <h3 className="font-medium flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm">4</span>
              Copy Configuration
            </h3>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Get your Firebase config and update the app
            </p>
            <div className="space-y-3">
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>• Go to Project Settings → General → Your apps</div>
                <div>• Find your web app and click the config icon</div>
                <div>• Copy the config object values</div>
                <div>• Update <code className="bg-muted px-1 rounded">utils/firebase/dev-config.tsx</code></div>
              </div>
              
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Configuration Template:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyConfig}
                    className="h-8"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 mr-1" />
                    ) : (
                      <Copy className="h-4 w-4 mr-1" />
                    )}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                  <code>{configTemplate}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="border-l-2 border-primary pl-4">
            <h3 className="font-medium flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm">5</span>
              Test Connection
            </h3>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Save the file and refresh the page to test the connection
            </p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>• The status indicator should turn green</div>
              <div>• Sample data will be automatically created</div>
              <div>• Admin login will be available at <code className="bg-muted px-1 rounded">/admin</code></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Helper */}
      <FirebaseConfigForm />

      {/* Important Notes */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important Notes</AlertTitle>
        <AlertDescription className="space-y-2">
          <div>• Keep your Firebase configuration secure and don't commit sensitive keys to public repositories</div>
          <div>• The default admin credentials are: <strong>admin@cartify.com</strong> / <strong>CartifySecure2024!</strong></div>
          <div>• Firestore security rules are automatically configured for your application</div>
          <div>• All data is stored in real-time and synced across devices</div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
