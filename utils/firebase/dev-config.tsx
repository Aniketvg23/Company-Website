// Firebase Configuration for Cartify Automotive Industries
// Replace these with your actual Firebase project configuration

export const DEV_FIREBASE_CONFIG = {
  // Your Firebase Project Configuration
  // Replace these placeholder values with your actual Firebase config
  
  apiKey: "AIzaSyBTw-8bUJvLRlsn_HVgvKgYtjbSmZ8J3Tw",
  authDomain: "cartify-automotive.firebaseapp.com",
  projectId: "cartify-automotive",
  storageBucket: "cartify-automotive.firebasestorage.app",
  messagingSenderId: "757562360193",
  appId: "1:757562360193:web:9aef4c740e4b8d2b156880",

  /* 
  To get your actual values:
  1. Go to https://console.firebase.google.com/
  2. Create a new project named "cartify-automotive"
  3. Go to Project Settings > General > Your apps
  4. Add a web app named "Cartify Website"
  5. Copy the config values and replace the placeholders above
  
  Example of what the real values look like:
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "cartify-automotive.firebaseapp.com",
  projectId: "cartify-automotive", 
  storageBucket: "cartify-automotive.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789abcdef"
  */
};

// Log configuration status
if (DEV_FIREBASE_CONFIG.apiKey === "YOUR_FIREBASE_API_KEY_HERE") {
  console.log(`
🔧 Firebase Setup Required for Cartify

Your Firebase project needs to be configured. Visit /firebase-setup for detailed instructions.

Quick Setup:
1. Go to https://console.firebase.google.com/
2. Create project: "cartify-automotive" 
3. Enable Authentication (Email/Password) and Firestore
4. Copy your config values into /utils/firebase/dev-config.tsx
5. Refresh this page

Current status: Demo mode active
  `);
} else {
  console.log('🔥 Firebase configured for Cartify Automotive Industries');
  console.log('🔍 Project ID:', DEV_FIREBASE_CONFIG.projectId);
  console.log('🌐 Auth Domain:', DEV_FIREBASE_CONFIG.authDomain);
}
