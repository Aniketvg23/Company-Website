import { Badge } from "./ui/badge";
import { Wifi, AlertCircle, Settings } from "lucide-react";
import { useRealtimeData } from "../contexts/RealtimeDataContext";
import { useNavigate } from "react-router-dom";
import { isUsingDemoConfig } from "../utils/firebase/env";

export function ConnectionStatus() {
  const { loading, error } = useRealtimeData();
  const navigate = useNavigate();
  const needsSetup = isUsingDemoConfig();
  
  if (loading) {
    return (
      <Badge 
        variant="secondary"
        className="fixed bottom-4 right-4 z-50 bg-blue-500 hover:bg-blue-600 text-white cursor-default"
      >
        <div className="w-3 h-3 mr-1 animate-spin border border-white border-t-transparent rounded-full" />
        Connecting to Firebase...
      </Badge>
    );
  }

  if (error) {
    const isPermissionError = error.includes('permission-denied') || error.includes('Permission denied');
    const isConfigError = error.includes('Invalid Firebase') || error.includes('not found');
    
    return (
      <Badge 
        variant="secondary"
        className="fixed bottom-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white cursor-pointer"
        onClick={() => navigate('/firebase-setup')}
        title={error}
      >
        <AlertCircle className="w-3 h-3 mr-1" />
        {isPermissionError ? 'Firestore Rules' : isConfigError ? 'Config Error' : 'Setup Required'}
      </Badge>
    );
  }

  if (needsSetup) {
    return (
      <Badge 
        variant="secondary"
        className="fixed bottom-4 right-4 z-50 bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer"
        onClick={() => navigate('/firebase-setup')}
      >
        <Settings className="w-3 h-3 mr-1" />
        Demo Mode
      </Badge>
    );
  }

  return null;
}
