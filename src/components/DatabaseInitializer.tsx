import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Database, CheckCircle, AlertCircle, Loader2, Users, Briefcase, Factory, Package, MessageSquare } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface DatabaseStats {
  products: { total: number; active: number };
  machinery: { total: number; active: number };
  jobs: { total: number; active: number };
  contacts: { total: number; new: number; responded: number };
  applications: { total: number; submitted: number; reviewed: number; shortlisted: number };
}

export function DatabaseInitializer() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [adminCreated, setAdminCreated] = useState(false);

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    try {
      // Check if we have an admin token in localStorage
      const adminToken = localStorage.getItem('cartify_admin_token');
      if (!adminToken) {
        setError('Please log in as admin first');
        return;
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-aa812cee/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
        setIsInitialized(data.products.total > 0 || data.machinery.total > 0 || data.jobs.total > 0);
      } else {
        console.log('Could not fetch stats, database may need initialization');
      }
    } catch (error) {
      console.log('Database status check failed:', error);
    }
  };

  const initializeAdmin = async () => {
    try {
      setError(null);
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-aa812cee/init-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setAdminCreated(true);
        console.log('✅ Admin user created:', data);
      } else {
        console.log('Admin creation response:', data);
        if (data.message && data.message.includes('already exists')) {
          setAdminCreated(true);
        }
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      setError('Failed to create admin user');
    }
  };

  const initializeDatabase = async () => {
    try {
      setIsInitializing(true);
      setError(null);

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-aa812cee/init-database`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Database initialized:', data);
        setIsInitialized(true);
        await checkDatabaseStatus(); // Refresh stats
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to initialize database');
      }
    } catch (error) {
      console.error('Database initialization error:', error);
      setError('Failed to initialize database');
    } finally {
      setIsInitializing(false);
    }
  };

  const getStatusIcon = (isReady: boolean, isLoading?: boolean) => {
    if (isLoading) return <Loader2 className="w-4 h-4 animate-spin text-orange-500" />;
    return isReady ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-orange-500" />;
  };

  const getStatusBadge = (isReady: boolean, isLoading?: boolean) => {
    if (isLoading) return <Badge variant="secondary">Initializing...</Badge>;
    return isReady ? <Badge className="bg-green-100 text-green-800">Ready</Badge> : <Badge variant="outline">Not Initialized</Badge>;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Database className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Database Management</h1>
        </div>
        <p className="text-muted-foreground">
          Initialize and manage your Cartify database with sample data for products, machinery, jobs, and more.
        </p>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Admin Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Admin Setup</span>
              {getStatusIcon(adminCreated)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Admin User</span>
              {getStatusBadge(adminCreated)}
            </div>
            <div className="text-sm text-muted-foreground">
              <p><strong>Email:</strong> admin@cartify.com</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
            <Button 
              onClick={initializeAdmin}
              disabled={adminCreated}
              variant={adminCreated ? "outline" : "default"}
              className="w-full"
            >
              {adminCreated ? 'Admin User Ready' : 'Create Admin User'}
            </Button>
          </CardContent>
        </Card>

        {/* Database Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Database Status</span>
              {getStatusIcon(isInitialized, isInitializing)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Sample Data</span>
              {getStatusBadge(isInitialized, isInitializing)}
            </div>
            <Button 
              onClick={initializeDatabase}
              disabled={isInitializing || isInitialized}
              variant={isInitialized ? "outline" : "default"}
              className="w-full"
            >
              {isInitializing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Initializing...
                </>
              ) : isInitialized ? (
                'Database Ready'
              ) : (
                'Initialize Database'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Database Statistics */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Database Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="text-center space-y-2">
                <Package className="w-8 h-8 text-blue-500 mx-auto" />
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{stats.products.active}</div>
                  <div className="text-sm text-muted-foreground">Active Products</div>
                  <div className="text-xs text-muted-foreground">({stats.products.total} total)</div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <Factory className="w-8 h-8 text-orange-500 mx-auto" />
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{stats.machinery.active}</div>
                  <div className="text-sm text-muted-foreground">Active Machines</div>
                  <div className="text-xs text-muted-foreground">({stats.machinery.total} total)</div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <Briefcase className="w-8 h-8 text-green-500 mx-auto" />
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{stats.jobs.active}</div>
                  <div className="text-sm text-muted-foreground">Open Positions</div>
                  <div className="text-xs text-muted-foreground">({stats.jobs.total} total)</div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <MessageSquare className="w-8 h-8 text-purple-500 mx-auto" />
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{stats.contacts.new}</div>
                  <div className="text-sm text-muted-foreground">New Contacts</div>
                  <div className="text-xs text-muted-foreground">({stats.contacts.total} total)</div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <Users className="w-8 h-8 text-red-500 mx-auto" />
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{stats.applications.submitted}</div>
                  <div className="text-sm text-muted-foreground">New Applications</div>
                  <div className="text-xs text-muted-foreground">({stats.applications.total} total)</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">1</div>
              <div>
                <h4 className="font-medium">Create Admin User</h4>
                <p className="text-sm text-muted-foreground">Set up the admin account for managing your business data.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">2</div>
              <div>
                <h4 className="font-medium">Initialize Database</h4>
                <p className="text-sm text-muted-foreground">Populate the database with sample products, machinery, and job listings.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">3</div>
              <div>
                <h4 className="font-medium">Access Admin Dashboard</h4>
                <p className="text-sm text-muted-foreground">Log in with the admin credentials to manage your business operations.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
