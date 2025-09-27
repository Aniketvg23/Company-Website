// Environment Configuration Checker for Firebase
import { getFirebaseEnvConfig, isUsingDemoConfig, validateFirebaseConfig } from './env';

export interface EnvCheckResult {
  isValid: boolean;
  missingVars: string[];
  warnings: string[];
}

export function checkFirebaseEnv(): EnvCheckResult {
  const validation = validateFirebaseConfig();
  const usingDemo = isUsingDemoConfig();

  const warnings: string[] = [...validation.errors];
  
  if (usingDemo) {
    warnings.push('Using demo Firebase configuration - replace with actual project settings');
  }

  return {
    isValid: validation.isValid && !usingDemo,
    missingVars: validation.isValid ? [] : ['Firebase configuration incomplete'],
    warnings
  };
}

export function getFirebaseConfig() {
  return getFirebaseEnvConfig();
}

export function generateEnvTemplate(): string {
  return `# Firebase Configuration for Cartify Automotive Industries
# Replace these values with your actual Firebase project configuration

REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# How to get these values:
# 1. Go to https://console.firebase.google.com/
# 2. Select your project
# 3. Go to Project Settings (gear icon)
# 4. Scroll down to "Your apps" section
# 5. Click on the web app icon (</>)
# 6. Copy the config values from the Firebase SDK snippet
`;
}
