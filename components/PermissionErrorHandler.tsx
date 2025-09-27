import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  Shield, 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  AlertTriangle,
  Database,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PermissionErrorHandlerProps {
  error: string | null;
  operation?: string; // e.g., "creating products", "updating machinery"
  onDismiss?: () => void;
}

export function PermissionErrorHandler({ 
  error, 
  operation = "performing admin operations",
  onDismiss 
}: PermissionErrorHandlerProps) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Check if this is a permission error
  const isPermissionError = error && (
    error.includes('permission-denied') || 
    error.includes('Permission denied') ||
    error.includes('security rules')
  );

  const quickRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Quick setup - allows all operations (for development only)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;

  const copyRules = async () => {
    try {
      await navigator.clipboard.writeText(quickRules);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Don't render if no permission error
  if (!isPermissionError) {
    return null;
  }

  return (
    <Card className="border-red-200 bg-red-50 mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-800">
          <Shield className="h-5 w-5" />
          Permission Required for Admin Operations
          <Badge variant="destructive">Setup Required</Badge>
        </CardTitle>
        <CardDescription className="text-red-700">
          Your Firebase project is connected, but you need to configure Firestore security rules to allow {operation}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-800">Quick Fix Available</AlertTitle>
          <AlertDescription className="text-orange-700">
            This permission error is normal for new Firebase projects. Follow the steps below to fix it in 2 minutes.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quick Fix */}
          <div className="space-y-3">
            <h4 className="font-medium text-red-800">🚀 Quick Fix (2 minutes)</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="w-6 h-6 p-0 text-xs">1</Badge>
                <span>Open Firebase Console</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="w-6 h-6 p-0 text-xs">2</Badge>
                <span>Go to Firestore → Rules</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="w-6 h-6 p-0 text-xs">3</Badge>
                <span>Copy rules below and paste</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="w-6 h-6 p-0 text-xs">4</Badge>
                <span>Click "Publish"</span>
              </div>
            </div>

            <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs relative">
              <pre>{quickRules}</pre>
              <Button
                size="sm"
                variant="secondary"
                onClick={copyRules}
                className="absolute top-2 right-2 h-6 px-2 text-xs"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <h4 className="font-medium text-red-800">🔧 Actions</h4>
            
            <div className="space-y-2">
              <Button 
                onClick={() => window.open('https://console.firebase.google.com/project/_/firestore/rules', '_blank')}
                className="w-full bg-red-600 hover:bg-red-700"
                size="sm"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Firebase Console
              </Button>
              
              <Button 
                onClick={() => navigate('/firebase-setup')}
                variant="outline"
                className="w-full border-red-300 text-red-700 hover:bg-red-100"
                size="sm"
              >
                <Settings className="h-4 w-4 mr-2" />
                Complete Setup Guide
              </Button>
              
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full border-red-300 text-red-700 hover:bg-red-100"
                size="sm"
              >
                <Database className="h-4 w-4 mr-2" />
                Refresh After Setup
              </Button>
              
              {onDismiss && (
                <Button 
                  onClick={onDismiss}
                  variant="ghost"
                  className="w-full text-red-700 hover:bg-red-100"
                  size="sm"
                >
                  Dismiss
                </Button>
              )}
            </div>
          </div>
        </div>

        <Separator />

        <Alert className="border-blue-200 bg-blue-50">
          <Database className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">What This Does</AlertTitle>
          <AlertDescription className="text-blue-700 text-sm">
            These rules allow all read/write operations for development. Once your app is working, 
            you can visit the Complete Setup Guide for production-ready security rules.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
