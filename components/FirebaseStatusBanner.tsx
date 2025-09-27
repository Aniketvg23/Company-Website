import React from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { AlertCircle, Settings, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRealtimeData } from '../contexts/RealtimeDataContext';
import { isUsingDemoConfig } from '../utils/firebase/env';
import { FirestoreRulesAlert } from './FirestoreRulesAlert';
import { FirebaseSuccessAlert } from './FirebaseSuccessAlert';

export function FirebaseStatusBanner() {
  const { loading, error } = useRealtimeData();
  const navigate = useNavigate();
  const needsSetup = isUsingDemoConfig();
  
  // Show success banner if Firebase is working and not in demo mode
  if (!loading && !error && !needsSetup) {
    return <FirebaseSuccessAlert />;
  }
  
  // Don't show banner if loading
  if (loading) {
    return null;
  }

  // Demo mode banner
  if (needsSetup && !error) {
    return (
      <Alert className="mb-6 border-yellow-200 bg-yellow-50">
        <Settings className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Demo Mode Active</AlertTitle>
        <AlertDescription className="text-yellow-700">
          <div className="flex items-center justify-between mt-2">
            <span>
              You're running Cartify in demo mode. Set up Firebase to enable data persistence and real-time updates.
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/firebase-setup')}
              className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
            >
              <Settings className="h-4 w-4 mr-2" />
              Setup Firebase
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Error banner
  if (error) {
    const isPermissionError = error.includes('permission-denied') || error.includes('Permission denied') || error.includes('security rules');
    const isConfigError = error.includes('Invalid Firebase') || error.includes('not found') || error.includes('API key');
    
    // Show detailed Firestore rules alert for permission errors
    if (isPermissionError) {
      return <FirestoreRulesAlert />;
    }
    
    return (
      <Alert className="mb-6 border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-800">
          {isConfigError ? 'Configuration Error' : 'Firebase Connection Error'}
        </AlertTitle>
        <AlertDescription className="text-red-700">
          <div className="flex items-center justify-between mt-2">
            <span>
              {isConfigError 
                ? 'Firebase configuration is invalid. Please check your project settings.'
                : error
              }
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/firebase-setup')}
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              <Wrench className="h-4 w-4 mr-2" />
              Fix Now
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
