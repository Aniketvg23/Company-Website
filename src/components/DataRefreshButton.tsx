import { useState } from "react";
import { Button } from "./ui/button";
import { RefreshCw, CheckCircle, AlertCircle, Zap } from "lucide-react";
import { useRealtimeData } from "../contexts/RealtimeDataContext";
import { Badge } from "./ui/badge";
import { DataSyncHelper } from "../utils/firebase/dataSync";
import { StaleDataCleaner } from "../utils/firebase/staleDataCleaner";

export function DataRefreshButton() {
  const { refreshData, products, machinery, jobs, contacts, applications, loading, error, lastSync, isBackendAvailable } = useRealtimeData();
  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
    } catch (err) {
      console.error('Manual refresh failed:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleForceSync = async () => {
    setSyncing(true);
    try {
      console.log('🔄 Starting force sync from Firestore...');
      
      // Clean up stale data first
      await StaleDataCleaner.performAutoCleanup();
      
      // Then force refresh from Firestore
      await DataSyncHelper.forceRefreshFromFirestore();
      await refreshData(); // Refresh the context data
      
      console.log('✅ Force sync and cleanup completed');
    } catch (err) {
      console.error('Force sync failed:', err);
    } finally {
      setSyncing(false);
    }
  };

  const getStatusColor = () => {
    if (error) return "bg-red-50 text-red-700 border-red-200";
    if (isBackendAvailable) return "bg-green-50 text-green-700 border-green-200";
    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  };

  const getStatusIcon = () => {
    if (error) return <AlertCircle className="w-4 h-4" />;
    if (isBackendAvailable) return <CheckCircle className="w-4 h-4" />;
    return <RefreshCw className="w-4 h-4" />;
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50" style={{ display: 'none' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Data Status</h3>
        <div className="flex space-x-1">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing || loading || syncing}
            className="h-8 px-2"
          >
            <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleForceSync}
            disabled={refreshing || loading || syncing}
            className="h-8 px-2"
            title="Force sync from Firebase"
          >
            <Zap className={`w-3 h-3 ${syncing ? 'animate-pulse' : ''}`} />
          </Button>
        </div>
      </div>
      
      <div className={`flex items-center space-x-2 p-2 rounded border ${getStatusColor()} mb-3`}>
        {getStatusIcon()}
        <span className="text-xs font-medium">
          {error ? 'Error' : isBackendAvailable ? 'Connected' : 'Connecting...'}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span>Products:</span>
          <Badge variant="secondary" className="text-xs">{products.length}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span>Machinery:</span>
          <Badge variant="secondary" className="text-xs">{machinery.length}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span>Jobs:</span>
          <Badge variant="secondary" className="text-xs">{jobs.length}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span>Contacts:</span>
          <Badge variant="secondary" className="text-xs">{contacts.length}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span>Applications:</span>
          <Badge variant="secondary" className="text-xs">{applications.length}</Badge>
        </div>
      </div>

      {lastSync && (
        <div className="text-xs text-muted-foreground mt-3 pt-2 border-t">
          Last sync: {new Date(lastSync).toLocaleTimeString()}
        </div>
      )}

      {error && (
        <div className="text-xs text-red-600 mt-2 p-2 bg-red-50 rounded border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
}
