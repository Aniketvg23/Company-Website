import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Loader2, CheckCircle, AlertCircle, Database, Play, Users, Package, Briefcase } from "lucide-react";
import { runFullDatabaseSetup, testDatabaseConnection, initializeAdminUser, initializeSampleData } from "../utils/databaseTest";

export function DatabaseSetupGuide() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    connection: boolean | null;
    admin: boolean | null;
    data: boolean | null;
    complete: boolean;
  }>({
    connection: null,
    admin: null,
    data: null,
    complete: false
  });
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, message]);
  };

  const runSetup = async () => {
    setLoading(true);
    setLogs([]);
    setStatus({ connection: null, admin: null, data: null, complete: false });

    try {
      // Test connection
      addLog("🔄 Testing database connection...");
      const connectionOk = await testDatabaseConnection();
      setStatus(prev => ({ ...prev, connection: connectionOk }));
      
      if (!connectionOk) {
        addLog("❌ Database connection failed");
        return;
      }
      addLog("✅ Database connection successful");

      // Initialize admin (DISABLED - using localStorage auth)
      addLog("👤 Skipping Firebase admin user (using localStorage auth)...");
      const adminOk = true; // Always true since we're using localStorage auth
      setStatus(prev => ({ ...prev, admin: adminOk }));
      
      if (adminOk) {
        addLog("✅ Admin user ready");
      } else {
        addLog("❌ Admin user creation failed");
      }

      // Initialize data
      addLog("📊 Setting up sample data...");
      const dataOk = await initializeSampleData();
      setStatus(prev => ({ ...prev, data: dataOk }));
      
      if (dataOk) {
        addLog("✅ Sample data initialized");
      } else {
        addLog("❌ Sample data initialization failed");
      }

      const complete = connectionOk && adminOk && dataOk;
      setStatus(prev => ({ ...prev, complete }));

      if (complete) {
        addLog("🎉 Database setup completed successfully!");
        addLog("🔑 Admin credentials: admin@cartify.com / CartifySecure2024!");
        addLog("🌐 Access admin dashboard: /admin/login");
      } else {
        addLog("⚠️ Database setup incomplete - some steps failed");
      }

    } catch (error) {
      addLog(`❌ Setup error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
    if (status) return <CheckCircle className="w-4 h-4 text-green-600" />;
    return <AlertCircle className="w-4 h-4 text-red-600" />;
  };

  const getStatusBadge = (status: boolean | null) => {
    if (status === null) return <Badge variant="outline">Pending</Badge>;
    if (status) return <Badge className="bg-green-100 text-green-800">Success</Badge>;
    return <Badge variant="destructive">Failed</Badge>;
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Database className="w-6 h-6 text-primary" />
          <CardTitle>Database Setup Assistant</CardTitle>
        </div>
        <CardDescription>
          Initialize your Cartify database with admin user and sample data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Setup Steps */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {getStatusIcon(status.connection)}
              <span className="font-medium">Database Connection</span>
            </div>
            {getStatusBadge(status.connection)}
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {getStatusIcon(status.admin)}
              <span className="font-medium">Admin User Setup</span>
            </div>
            {getStatusBadge(status.admin)}
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {getStatusIcon(status.data)}
              <span className="font-medium">Sample Data</span>
            </div>
            {getStatusBadge(status.data)}
          </div>
        </div>

        {/* Action Button */}
        <Button 
          onClick={runSetup} 
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Setting up database...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Initialize Database
            </>
          )}
        </Button>

        {/* Success Message */}
        {status.complete && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>🎉 Setup Complete!</strong> Your database is ready. You can now access the admin dashboard with the secure credentials.
            </AlertDescription>
          </Alert>
        )}

        {/* Sample Data Preview */}
        {status.data && (
          <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
            <div className="text-center">
              <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium">6 Products</p>
              <p className="text-xs text-gray-600">Plastic bags & films</p>
            </div>
            <div className="text-center">
              <Database className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium">4 Machines</p>
              <p className="text-xs text-gray-600">Manufacturing equipment</p>
            </div>
            <div className="text-center">
              <Briefcase className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium">3 Jobs</p>
              <p className="text-xs text-gray-600">Career opportunities</p>
            </div>
          </div>
        )}

        {/* Logs */}
        {logs.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Setup Log:</h4>
            <div className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono max-h-32 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index}>{log}</div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
