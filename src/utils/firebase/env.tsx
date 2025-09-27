// Environment variable handling for Firebase
// This provides a fallback system for development and production environments

interface FirebaseEnvConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Default demo configuration - replace with actual values
const DEMO_CONFIG: FirebaseEnvConfig = {
  apiKey: 'demo-api-key',
  authDomain: 'cartify-demo.firebaseapp.com',
  projectId: 'cartify-demo',
  storageBucket: 'cartify-demo.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef123456789'
};

// Import development configuration
import { DEV_FIREBASE_CONFIG } from './dev-config';

// Convert dev config to the format we need
const DEV_CONFIG: Partial<FirebaseEnvConfig> = {
  apiKey: DEV_FIREBASE_CONFIG.apiKey || undefined,
  authDomain: DEV_FIREBASE_CONFIG.authDomain || undefined,
  projectId: DEV_FIREBASE_CONFIG.projectId || undefined,
  storageBucket: DEV_FIREBASE_CONFIG.storageBucket || undefined,
  messagingSenderId: DEV_FIREBASE_CONFIG.messagingSenderId || undefined,
  appId: DEV_FIREBASE_CONFIG.appId || undefined,
};

// Get environment variable with fallbacks
export function getFirebaseEnvVar(key: keyof FirebaseEnvConfig): string {
  // Try different sources for environment variables
  let value: string | undefined;

  // 1. Try window.__ENV__ (injected by build process)
  if (typeof window !== 'undefined' && (window as any).__ENV__) {
    value = (window as any).__ENV__[`REACT_APP_FIREBASE_${key.toUpperCase()}`];
  }

  // 2. Try import.meta.env (Vite)
  if (!value && typeof import.meta !== 'undefined' && import.meta.env) {
    value = import.meta.env[`REACT_APP_FIREBASE_${key.toUpperCase()}`];
  }

  // 3. Try development config override
  if (!value && DEV_CONFIG[key]) {
    value = DEV_CONFIG[key];
  }

  // 4. Fallback to demo config
  if (!value) {
    value = DEMO_CONFIG[key];
  }

  return value;
}

// Get full Firebase configuration
export function getFirebaseEnvConfig(): FirebaseEnvConfig {
  return {
    apiKey: getFirebaseEnvVar('apiKey'),
    authDomain: getFirebaseEnvVar('authDomain'),
    projectId: getFirebaseEnvVar('projectId'),
    storageBucket: getFirebaseEnvVar('storageBucket'),
    messagingSenderId: getFirebaseEnvVar('messagingSenderId'),
    appId: getFirebaseEnvVar('appId')
  };
}

// Check if using demo configuration
export function isUsingDemoConfig(): boolean {
  const config = getFirebaseEnvConfig();
  return config.apiKey === DEMO_CONFIG.apiKey || 
         config.projectId === DEMO_CONFIG.projectId ||
         config.apiKey.includes('demo') ||
         config.projectId.includes('demo');
}

// Validate configuration
export function validateFirebaseConfig(): { isValid: boolean; errors: string[] } {
  const config = getFirebaseEnvConfig();
  const errors: string[] = [];
  
  // Check for placeholder or invalid values
  const placeholderValues = [
    'demo-api-key',
    'YOUR_FIREBASE_API_KEY_HERE',
    'YOUR_MESSAGING_SENDER_ID',
    'YOUR_FIREBASE_APP_ID'
  ];

  if (!config.apiKey || placeholderValues.includes(config.apiKey) || config.apiKey === 'demo-api-key') {
    errors.push('Firebase API key needs to be configured with your actual project key');
  }

  if (!config.projectId || config.projectId === 'cartify-demo') {
    errors.push('Firebase project ID needs to be your actual project ID from Firebase Console');
  }

  if (!config.authDomain || config.authDomain.includes('demo')) {
    errors.push('Firebase auth domain needs to be configured with your actual project domain');
  }

  if (!config.messagingSenderId || placeholderValues.includes(config.messagingSenderId)) {
    errors.push('Firebase messaging sender ID needs to be configured');
  }

  if (!config.appId || placeholderValues.includes(config.appId)) {
    errors.push('Firebase app ID needs to be configured');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
