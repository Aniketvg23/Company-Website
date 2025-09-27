import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertTriangle, Settings, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function FirebaseRequiredNotice() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Firebase Setup Required
          </h1>
          <p className="text-gray-600">
            Please configure Firebase to enable the full functionality of Cartify
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              What needs to be configured?
            </CardTitle>
            <CardDescription>
              Firebase provides the backend services for this application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium">Firestore Database</h4>
                  <p className="text-sm text-gray-600">
                    For storing products, machinery, jobs, contacts, and applications
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium">Authentication</h4>
                  <p className="text-sm text-gray-600">
                    For admin access and user management
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium">Real-time Updates</h4>
                  <p className="text-sm text-gray-600">
                    For live data synchronization across devices
                  </p>
                </div>
              </div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Quick Setup</AlertTitle>
              <AlertDescription>
                Setup takes about 5 minutes. We'll guide you through creating a Firebase project 
                and configuring the necessary services.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3 pt-2">
              <Button 
                onClick={() => navigate('/firebase-setup')}
                className="flex-1"
              >
                <Settings className="h-4 w-4 mr-2" />
                Setup Firebase
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>
            Need help? Check out our{' '}
            <a 
              href="https://firebase.google.com/docs/web/setup" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-500 hover:underline"
            >
              Firebase documentation
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
