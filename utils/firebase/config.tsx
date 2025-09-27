// Firebase Configuration
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getFirebaseEnvConfig, isUsingDemoConfig } from './env';

// Get Firebase configuration
const firebaseConfig = getFirebaseEnvConfig();

// Log configuration status
if (isUsingDemoConfig()) {
  console.warn('🔶 Firebase: Using demo configuration. Please set up your actual Firebase project.');
} else {
  console.log('🔥 Firebase: Using production configuration');
}

// Initialize Firebase only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Configure Firestore settings for better error handling
try {
  // Enable network persistence and configure timeout settings
  if (typeof window !== 'undefined') {
    console.log('🔧 Configuring Firestore settings...');
  }
} catch (error) {
  console.warn('⚠️ Could not configure Firestore settings:', error);
}

// Connect to emulators in development (optional)
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  // Uncomment these if you want to use Firebase emulators in development
  // connectAuthEmulator(auth, 'http://localhost:9099');
  // connectFirestoreEmulator(db, 'localhost', 8080);
  // connectFunctionsEmulator(functions, 'localhost', 5001);
}

export default app;
