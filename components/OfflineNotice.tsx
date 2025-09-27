import { Alert, AlertDescription } from "./ui/alert";
import { WifiOff, Info } from "lucide-react";

export function OfflineNotice() {
  return (
    <Alert className="mb-4 border-blue-200 bg-blue-50">
      <Info className="h-4 w-4 text-blue-500" />
      <AlertDescription className="text-blue-700">
        <strong>Offline Mode:</strong> The application is currently working in offline mode. All your data is stored locally and will be available when you return.
      </AlertDescription>
    </Alert>
  );
}
