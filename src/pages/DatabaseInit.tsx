import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { DatabaseSetupGuide } from "../components/DatabaseSetupGuide";
import { AuthDebugger } from "../components/AuthDebugger";
import { SecureCredentials } from "../components/SecureCredentials";
import { Database, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";

export function DatabaseInit() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'setup' | 'debug' | 'credentials'>('setup');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/login')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cartify Database Management
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Initialize your database, troubleshoot authentication issues, and manage your admin credentials
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-center space-x-4">
          <Button
            variant={activeTab === 'setup' ? 'default' : 'outline'}
            onClick={() => setActiveTab('setup')}
            className="flex items-center space-x-2"
          >
            <Database className="w-4 h-4" />
            <span>Database Setup</span>
          </Button>
          <Button
            variant={activeTab === 'debug' ? 'default' : 'outline'}
            onClick={() => setActiveTab('debug')}
            className="flex items-center space-x-2"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Auth Debugger</span>
          </Button>
          <Button
            variant={activeTab === 'credentials' ? 'default' : 'outline'}
            onClick={() => setActiveTab('credentials')}
            className="flex items-center space-x-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Secure Credentials</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        {activeTab === 'setup' && (
          <div className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50">
              <Database className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Database Setup:</strong> Initialize your Cartify database with admin user, sample products, 
                machinery data, and job postings. This is a one-time setup process.
              </AlertDescription>
            </Alert>
            <DatabaseSetupGuide />
          </div>
        )}

        {activeTab === 'debug' && (
          <div className="space-y-6">
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Authentication Debugger:</strong> If you're having trouble logging in, 
                this tool will help diagnose and fix authentication issues.
              </AlertDescription>
            </Alert>
            <AuthDebugger />
          </div>
        )}

        {activeTab === 'credentials' && (
          <div className="space-y-6">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Secure Credentials:</strong> Save these admin credentials in your password manager 
                to avoid Google breach warnings and ensure secure access.
              </AlertDescription>
            </Alert>
            <SecureCredentials />
            
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-center">Quick Login</CardTitle>
                <CardDescription className="text-center">
                  Once you've saved the credentials, click below to login
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/admin/login')}
                  className="w-full"
                  size="lg"
                >
                  Go to Admin Login
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="max-w-4xl mx-auto mt-12 text-center">
        <Card className="p-6 bg-gradient-to-r from-gray-50 to-gray-100">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="flex justify-center space-x-4">
            <Button 
              variant="outline"
              onClick={() => navigate('/')}
            >
              Public Website
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/admin/login')}
            >
              Admin Login
            </Button>
            <Button 
              variant="default"
              onClick={() => navigate('/admin/dashboard')}
            >
              Admin Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
