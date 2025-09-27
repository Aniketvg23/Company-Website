import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Loader2, Database, Shield, Zap } from 'lucide-react';

interface LoadingStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  completed: boolean;
}

interface LoadingProgressProps {
  loading: boolean;
  error?: string | null;
}

export function LoadingProgress({ loading, error }: LoadingProgressProps) {
  const [steps, setSteps] = useState<LoadingStep[]>([
    { id: 'config', label: 'Validating Configuration', icon: <Shield className="h-4 w-4" />, completed: false },
    { id: 'connect', label: 'Connecting to Firebase', icon: <Database className="h-4 w-4" />, completed: false },
    { id: 'data', label: 'Loading Data', icon: <Zap className="h-4 w-4" />, completed: false },
  ]);

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!loading) return;

    const timer = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = Math.min(prev + 1, steps.length - 1);
        
        setSteps(currentSteps => currentSteps.map((step, index) => ({
          ...step,
          completed: index < nextStep
        })));

        return nextStep;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, steps.length]);

  if (!loading) return null;

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center justify-center mb-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
          <span className="text-lg font-medium">Initializing Cartify</span>
        </div>

        <Progress value={progress} className="mb-6" />

        <div className="space-y-3">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                index === currentStep ? 'bg-primary/10' :
                step.completed ? 'bg-green-50' : 'bg-gray-50'
              }`}
            >
              <div className={`${
                step.completed ? 'text-green-600' :
                index === currentStep ? 'text-primary' : 'text-gray-400'
              }`}>
                {step.icon}
              </div>
              <span className={`text-sm ${
                step.completed ? 'text-green-700' :
                index === currentStep ? 'text-primary' : 'text-gray-600'
              }`}>
                {step.label}
              </span>
              {step.completed && (
                <div className="ml-auto">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              )}
              {index === currentStep && !step.completed && (
                <div className="ml-auto">
                  <Loader2 className="w-3 h-3 animate-spin text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              {error.includes('permission-denied') 
                ? 'Firestore security rules need setup'
                : 'Connection issue detected'
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
