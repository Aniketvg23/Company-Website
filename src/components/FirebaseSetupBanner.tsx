import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { AlertTriangle, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isUsingDemoConfig } from '../utils/firebase/env';

export function FirebaseSetupBanner() {
  const navigate = useNavigate();
  const needsSetup = isUsingDemoConfig();

  if (!needsSetup) {
    return null;
  }

  return (
    <Alert className="mx-4 my-4 border-yellow-200 bg-yellow-50">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-800">Firebase Setup Required</AlertTitle>
      <AlertDescription className="text-yellow-700">
        <div className="space-y-2">
          <p>
            Your Cartify website is running in demo mode. To enable full functionality including 
            admin dashboard, contact forms, and job applications, please configure Firebase.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/firebase-setup')}
            className="mt-2 border-yellow-300 text-yellow-800 hover:bg-yellow-100"
          >
            <Settings className="h-4 w-4 mr-2" />
            Setup Firebase
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
