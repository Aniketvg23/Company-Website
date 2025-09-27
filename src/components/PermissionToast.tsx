import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Shield, ExternalLink, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PermissionToastProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

export function PermissionToast({ show, message, onClose }: PermissionToastProps) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [show]);

  const isPermissionError = message && (
    message.includes('permission-denied') || 
    message.includes('Permission denied') ||
    message.includes('security rules')
  );

  if (!isVisible || !isPermissionError) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <Alert className="border-orange-200 bg-orange-50 shadow-lg">
        <Shield className="h-4 w-4 text-orange-600" />
        <div className="flex justify-between items-start">
          <AlertDescription className="text-orange-700 pr-2">
            <strong>Firestore Setup Required:</strong> Permission denied. Configure security rules to allow admin operations.
            <div className="flex gap-2 mt-2">
              <Button 
                size="sm" 
                onClick={() => window.open('https://console.firebase.google.com/project/_/firestore/rules', '_blank')}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Fix Now
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => navigate('/firebase-setup')}
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                Guide
              </Button>
            </div>
          </AlertDescription>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 text-orange-600 hover:text-orange-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Alert>
    </div>
  );
}
