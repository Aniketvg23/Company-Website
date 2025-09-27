import React, { useState } from 'react';
import { FirebaseConfigGuide } from '../components/FirebaseConfigGuide';
import { FirebaseDiagnostic } from '../components/FirebaseDiagnostic';
import { FirebaseConnectionFixer } from '../components/FirebaseConnectionFixer';
import { FirestoreRulesTest } from '../components/FirestoreRulesTest';
import { FirestoreRulesGuide } from '../components/FirestoreRulesGuide';
import { FirebaseConnectionTest } from '../components/FirebaseConnectionTest';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArrowLeft, Settings, Activity, Wrench, TestTube, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function FirebaseSetup() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <div className="flex-1">
              <h1 className="font-semibold">Firebase Setup & Diagnostics</h1>
              <p className="text-sm text-muted-foreground">
                Configure your Firebase project for Cartify Automotive Industries
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-6">
          <Tabs defaultValue="rules" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="rules" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security Rules
              </TabsTrigger>
              <TabsTrigger value="fixer" className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Fix Issues
              </TabsTrigger>
              <TabsTrigger value="test" className="flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                Test Rules
              </TabsTrigger>
              <TabsTrigger value="setup" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Setup Guide
              </TabsTrigger>
              <TabsTrigger value="diagnostics" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Diagnostics
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="rules" className="mt-6">
              <FirestoreRulesGuide />
            </TabsContent>
            
            <TabsContent value="fixer" className="mt-6">
              <FirebaseConnectionFixer onConnectionFixed={() => navigate('/')} />
            </TabsContent>
            
            <TabsContent value="test" className="mt-6">
              <FirestoreRulesTest />
            </TabsContent>
            
            <TabsContent value="setup" className="mt-6">
              <FirebaseConfigGuide />
            </TabsContent>
            
            <TabsContent value="diagnostics" className="mt-6">
              <div className="space-y-6">
                <FirebaseConnectionTest />
                <FirebaseDiagnostic />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
