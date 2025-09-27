import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, Circle, ArrowRight, Shield, AlertTriangle, Info } from 'lucide-react';
import { useState } from 'react';

export function LoginGuide() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Clear Browser Data",
      description: "Clear any cached login data that might be causing conflicts",
      action: "Press F12 → Application Tab → Clear Storage",
      status: "pending" as const
    },
    {
      title: "Initialize Admin User",
      description: "Create the admin user in the Supabase authentication system",
      action: "Click 'Initialize Admin User' button below the login form",
      status: "pending" as const
    },
    {
      title: "Wait for Initialization",
      description: "Allow 2-3 seconds for the user to be created in the system",
      action: "Wait for success message",
      status: "pending" as const
    },
    {
      title: "Login with Credentials",
      description: "Use the secure admin credentials to log in",
      action: "Email: admin@cartify.com, Password: CartifySecure2024!",
      status: "pending" as const
    },
    {
      title: "Access Admin Panel",
      description: "You should now be redirected to the admin dashboard",
      action: "Automatic redirect to /admin/dashboard",
      status: "pending" as const
    }
  ];

  const getStepIcon = (index: number) => {
    if (index < currentStep) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (index === currentStep) {
      return <ArrowRight className="w-5 h-5 text-blue-600" />;
    } else {
      return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetSteps = () => {
    setCurrentStep(0);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Step-by-Step Login Guide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Follow these steps if you're having trouble accessing the admin panel.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                index === currentStep 
                  ? 'bg-blue-50 border-blue-200' 
                  : index < currentStep 
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getStepIcon(index)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{step.title}</h4>
                  <Badge variant={index < currentStep ? 'default' : 'outline'} className="text-xs">
                    Step {index + 1}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {step.description}
                </p>
                
                <div className="text-xs bg-white p-2 rounded border">
                  <strong>Action:</strong> {step.action}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
          >
            Next
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetSteps}
            className="ml-auto"
          >
            Reset
          </Button>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Still having issues?</strong>
            <br />• Try the "Auto Fix" tool above
            <br />• Check browser console for error messages (F12)
            <br />• Ensure you have a stable internet connection
            <br />• Contact support if the problem persists
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
