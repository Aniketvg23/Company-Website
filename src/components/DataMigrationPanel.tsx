import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { useRealtimeData } from "../contexts/RealtimeDataContext";
import { 
  Database, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  RotateCcw,
  Wifi,
  WifiOff 
} from "lucide-react";

export function DataMigrationPanel() {
  const { 
    migrateData, 
    initializeDatabase, 
    refreshData, 
    isBackendAvailable, 
    products, 
    machinery, 
    jobs 
  } = useRealtimeData();
  
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'migrating' | 'success' | 'error'>('idle');
  const [migrationResults, setMigrationResults] = useState<any>(null);
  const [initializingDB, setInitializingDB] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Check if localStorage has data to migrate
  const checkLocalStorageData = () => {
    const stored = localStorage.getItem('cartify_offline_data');
    if (!stored) return null;
    
    try {
      const data = JSON.parse(stored);
      return {
        products: data.products?.length || 0,
        machinery: data.machinery?.length || 0,
        jobs: data.jobs?.length || 0,
        customers: data.customers?.length || 0,
        contacts: data.contacts?.length || 0,
        applications: data.applications?.length || 0
      };
    } catch {
      return null;
    }
  };

  const localData = checkLocalStorageData();

  const handleMigration = async () => {
    setMigrationStatus('migrating');
    setError('');
    
    try {
      const results = await migrateData();
      setMigrationResults(results);
      setMigrationStatus('success');
    } catch (err) {
      console.error('Migration failed:', err);
      setError(err instanceof Error ? err.message : 'Migration failed');
      setMigrationStatus('error');
    }
  };

  const handleInitializeDatabase = async () => {
    setInitializingDB(true);
    setError('');
    
    try {
      await initializeDatabase();
    } catch (err) {
      console.error('Database initialization failed:', err);
      setError(err instanceof Error ? err.message : 'Database initialization failed');
    } finally {
      setInitializingDB(false);
    }
  };

  const handleRefreshData = async () => {
    setRefreshing(true);
    setError('');
    
    try {
      await refreshData();
    } catch (err) {
      console.error('Data refresh failed:', err);
      setError(err instanceof Error ? err.message : 'Data refresh failed');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Backend Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isBackendAvailable ? (
              <Database className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-600" />
            )}
            Firebase Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              {isBackendAvailable ? (
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>
                  <span className="text-sm text-gray-600">Firestore real-time updates active</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">Setup Required</Badge>
                  <span className="text-sm text-gray-600">Firestore security rules needed</span>
                </div>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefreshData}
              disabled={refreshing}
            >
              {refreshing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RotateCcw className="w-4 h-4" />
              )}
              {isBackendAvailable ? 'Refresh' : 'Retry'}
            </Button>
          </div>
          
          {!isBackendAvailable && (
            <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-700">
                <strong>Firestore Security Rules Required:</strong> Your Firebase project needs security rules to allow data access. 
                Please add the required Firestore security rules in your Firebase Console to enable real-time updates and resolve connection errors.
              </p>
              <div className="mt-2 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://console.firebase.google.com', '_blank')}
                  className="text-xs"
                >
                  Open Firebase Console
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('/firebase-setup', '_blank')}
                  className="text-xs"
                >
                  Setup Guide
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Data Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Current Data Status
          </CardTitle>
          <CardDescription>
            Data currently stored in the backend database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{products.length}</div>
              <div className="text-sm text-gray-600">Products</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{machinery.length}</div>
              <div className="text-sm text-gray-600">Machinery</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{jobs.length}</div>
              <div className="text-sm text-gray-600">Jobs</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Migration */}
      {localData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Data Migration
            </CardTitle>
            <CardDescription>
              Migrate your localStorage data to the permanent database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Local Storage Data Found:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <div>{localData.products} Products</div>
                <div>{localData.machinery} Machinery</div>
                <div>{localData.jobs} Jobs</div>
                <div>{localData.customers} Customers</div>
                <div>{localData.contacts} Contacts</div>
                <div>{localData.applications} Applications</div>
              </div>
            </div>

            {migrationStatus === 'migrating' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Migrating data to backend...</span>
                </div>
                <Progress value={50} className="w-full" />
              </div>
            )}

            {migrationStatus === 'success' && migrationResults && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  <strong>Migration completed successfully!</strong>
                  <div className="mt-2 text-sm">
                    <div>✅ Products: {migrationResults.products?.success || 0} migrated</div>
                    <div>✅ Machinery: {migrationResults.machinery?.success || 0} migrated</div>
                    <div>✅ Jobs: {migrationResults.jobs?.success || 0} migrated</div>
                    {migrationResults.products?.failed || migrationResults.machinery?.failed || migrationResults.jobs?.failed ? (
                      <div className="text-orange-600 mt-1">
                        Some items failed to migrate - check console for details
                      </div>
                    ) : null}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {migrationStatus === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Migration failed: {error}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleMigration} 
              disabled={migrationStatus === 'migrating' || !isBackendAvailable}
              className="w-full"
            >
              {migrationStatus === 'migrating' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Migrating Data...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Migrate Data to Database
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Database Initialization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Database Initialization
          </CardTitle>
          <CardDescription>
            Initialize the database with sample data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            If you don't have any data to migrate, you can initialize the database with sample products, machinery, and jobs to get started.
          </p>
          <Button 
            variant="outline" 
            onClick={handleInitializeDatabase}
            disabled={initializingDB || !isBackendAvailable}
          >
            {initializingDB ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Initializing...
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                Initialize with Sample Data
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
