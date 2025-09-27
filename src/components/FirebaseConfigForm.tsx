import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Copy, Check, AlertCircle, Info } from 'lucide-react';

export function FirebaseConfigForm() {
  const [config, setConfig] = useState({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  });
  const [copied, setCopied] = useState(false);

  const generateConfigFile = () => {
    const configCode = `// Firebase Configuration for Cartify Automotive Industries
export const DEV_FIREBASE_CONFIG = {
  apiKey: "${config.apiKey}",
  authDomain: "${config.authDomain}",
  projectId: "${config.projectId}",
  storageBucket: "${config.storageBucket}",
  messagingSenderId: "${config.messagingSenderId}",
  appId: "${config.appId}",
};`;

    navigator.clipboard.writeText(configCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const allFieldsFilled = Object.values(config).every(value => value.trim() !== '');

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔧 Firebase Configuration Helper</CardTitle>
        <CardDescription>
          Enter your Firebase configuration values to generate the config file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Where to find these values</AlertTitle>
          <AlertDescription>
            Go to your Firebase project → Project Settings → General → Your apps → Web app → Config
          </AlertDescription>
        </Alert>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              placeholder="AIzaSyC..."
              value={config.apiKey}
              onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="authDomain">Auth Domain</Label>
            <Input
              id="authDomain"
              placeholder="your-project.firebaseapp.com"
              value={config.authDomain}
              onChange={(e) => setConfig(prev => ({ ...prev, authDomain: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectId">Project ID</Label>
            <Input
              id="projectId"
              placeholder="your-project-id"
              value={config.projectId}
              onChange={(e) => setConfig(prev => ({ ...prev, projectId: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="storageBucket">Storage Bucket</Label>
            <Input
              id="storageBucket"
              placeholder="your-project.appspot.com"
              value={config.storageBucket}
              onChange={(e) => setConfig(prev => ({ ...prev, storageBucket: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="messagingSenderId">Messaging Sender ID</Label>
            <Input
              id="messagingSenderId"
              placeholder="123456789012"
              value={config.messagingSenderId}
              onChange={(e) => setConfig(prev => ({ ...prev, messagingSenderId: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="appId">App ID</Label>
            <Input
              id="appId"
              placeholder="1:123456789012:web:abcdef123456789abcdef"
              value={config.appId}
              onChange={(e) => setConfig(prev => ({ ...prev, appId: e.target.value }))}
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button
            onClick={generateConfigFile}
            disabled={!allFieldsFilled}
            className="w-full"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Generate & Copy Config
              </>
            )}
          </Button>
          
          {!allFieldsFilled && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Fill in all fields to generate the configuration
            </p>
          )}
        </div>

        {copied && (
          <Alert>
            <Check className="h-4 w-4" />
            <AlertTitle>Configuration Copied!</AlertTitle>
            <AlertDescription>
              Paste this into your <code>/utils/firebase/dev-config.tsx</code> file, 
              replacing the existing DEV_FIREBASE_CONFIG object. Then refresh the page.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
