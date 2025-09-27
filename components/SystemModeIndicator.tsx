import { useRealtimeData } from "../contexts/RealtimeDataContext";
import { Badge } from "./ui/badge";
import { Wifi, WifiOff, Loader2 } from "lucide-react";

export function SystemModeIndicator() {
  const { isBackendAvailable, loading } = useRealtimeData();

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
        <span className="text-gray-600">Initializing...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {isBackendAvailable ? (
        <>
          <Wifi className="w-4 h-4 text-green-600" />
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            Online
          </Badge>
          <span className="text-green-700 hidden sm:inline">
            Real-time backend connected
          </span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-blue-600" />
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
            Offline
          </Badge>
          <span className="text-blue-700 hidden sm:inline">
            Using local storage
          </span>
        </>
      )}
    </div>
  );
}
