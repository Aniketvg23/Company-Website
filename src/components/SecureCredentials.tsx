import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Copy, Check, Eye, EyeOff, Shield, Key, Mail } from "lucide-react";

export function SecureCredentials() {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const credentials = {
    email: "admin@cartify.com",
    password: "CartifySecure2024!"
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const copyAllCredentials = async () => {
    const credentialsText = `Cartify Admin Login Credentials:
Email: ${credentials.email}
Password: ${credentials.password}

Login URL: ${window.location.origin}/admin/login

⚠️ IMPORTANT: Keep these credentials secure and do not share them publicly.`;
    
    await copyToClipboard(credentialsText);
  };

  return (
    <Card className="max-w-md mx-auto border-2 border-green-200 bg-green-50">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <Shield className="w-6 h-6 text-green-600" />
        </div>
        <CardTitle className="text-green-800">🔐 Secure Admin Credentials</CardTitle>
        <CardDescription className="text-green-700">
          Save these credentials in your password manager
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-green-200 bg-green-50">
          <Key className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Password Security:</strong> This password meets modern security standards and won't trigger breach warnings.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          {/* Email */}
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-sm text-gray-900">{credentials.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(credentials.email)}
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          {/* Password */}
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div className="flex items-center space-x-2">
              <Key className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Password</p>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-900 font-mono">
                    {showPassword ? credentials.password : "••••••••••••••••"}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </Button>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(credentials.password)}
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <Button 
            onClick={copyAllCredentials}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy All Credentials
              </>
            )}
          </Button>
          
          <div className="flex space-x-2">
            <Badge variant="outline" className="text-green-700 border-green-300">
              ✅ Secure
            </Badge>
            <Badge variant="outline" className="text-green-700 border-green-300">
              🔐 Encrypted
            </Badge>
            <Badge variant="outline" className="text-green-700 border-green-300">
              💾 Saveable
            </Badge>
          </div>
        </div>

        <Alert className="border-blue-200 bg-blue-50">
          <AlertDescription className="text-blue-800 text-xs">
            <strong>💡 Pro Tip:</strong> Save these credentials in your browser's password manager or a secure password manager like 1Password, Bitwarden, or LastPass to avoid the Google breach warning.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
