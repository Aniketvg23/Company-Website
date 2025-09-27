import { useRealtimeData } from "../contexts/RealtimeDataContext";
import { Alert, AlertDescription } from "./ui/alert";
import { Wifi, WifiOff, Info } from "lucide-react";

export function BackendStatus() {
  const { isBackendAvailable, loading } = useRealtimeData();

  if (loading) {
    return null; // Don't show anything while loading
  }

  if (isBackendAvailable) {
    return (
      <Alert className="mb-4 border-green-200 bg-green-50">
        <Wifi className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-700">
          <strong>Connected:</strong> Real-time backend is active. All changes are permanently saved.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-4 border-orange-200 bg-orange-50">
      <Info className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-700">
        <strong>Offline Mode:</strong> Backend server is not running. You can still use the admin interface, 
        but changes will only be saved locally. Start the Supabase server to enable permanent storage and real-time features.
      </AlertDescription>
    </Alert>
  );
}
