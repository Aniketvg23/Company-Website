# 🔥 Firebase Setup for Cartify Automotive Industries

This guide will help you set up Firebase for your Cartify website. The setup takes about 5 minutes and provides:

- **Real-time Database** - Store products, machinery, jobs, contacts, and applications
- **Authentication** - Secure admin access
- **Real-time Updates** - Live data synchronization
- **Offline Support** - Graceful handling when offline

## 🚀 Quick Setup Steps

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select existing project
3. Name it "cartify-automotive" (recommended)
4. Enable Google Analytics (optional)

### Step 2: Add Web App

1. In Firebase Console, go to Project Settings → General
2. Click "Add app" → Web icon (`</>`)
3. App name: "Cartify Website"
4. Check "Also set up Firebase Hosting" (optional)
5. Copy the configuration object

### Step 3: Enable Required Services

#### Firestore Database
1. Go to Build → Firestore Database
2. Click "Create database"
3. Start in **production mode** (recommended)
4. Choose your preferred region
5. Click "Done"

#### Authentication
1. Go to Build → Authentication
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

### Step 4: Configure Your App

1. Open `/utils/firebase/dev-config.tsx` in your project
2. Replace the placeholder values with your Firebase config:

\`\`\`typescript
export const DEV_FIREBASE_CONFIG = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "cartify-automotive.firebaseapp.com",
  projectId: "cartify-automotive",
  storageBucket: "cartify-automotive.appspot.com",
  messagingSenderId: "YOUR_ACTUAL_SENDER_ID",
  appId: "YOUR_ACTUAL_APP_ID",
};
\`\`\`

### Step 5: Test Setup

1. Save the file and refresh your website
2. The Firebase setup notice should disappear
3. Go to `/firebase-setup` to verify everything is working
4. The admin dashboard will be available at `/admin`

## 🔐 Default Admin Credentials

- **Email:** admin@cartify.com
- **Password:** CartifySecure2024!

> **Important:** Change these credentials after first login for security!

## 📊 What Gets Created Automatically

Once Firebase is configured, the app will automatically create:

### Sample Products (3 items)
- HDPE Carry Bags
- LDPE Packaging Films  
- Biodegradable Shopping Bags

### Sample Machinery (2 items)
- Blown Film Extrusion Line
- Flexographic Printing Press

### Sample Jobs (2 listings)
- Production Manager
- Quality Control Engineer

### Admin User
- Full access to dashboard
- Can manage all data
- Real-time updates enabled

## 🛠️ Firestore Security Rules

The app automatically configures these security rules:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access for products, machinery, and jobs
    match /{collection}/{document} {
      allow read: if resource.data.status == 'active';
      allow write: if request.auth != null;
    }
    
    // Admin-only access for contacts and applications
    match /contacts/{document} {
      allow read, write: if request.auth != null;
    }
    
    match /applications/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
\`\`\`

## 🔧 Troubleshooting

### Firebase Not Connecting
1. Check that all config values are correct
2. Ensure Firestore and Authentication are enabled
3. Verify your domain is authorized in Firebase Console

### Admin Login Issues
1. Make sure Authentication is enabled
2. Check that Email/Password provider is active
3. Try creating a new admin user manually

### Data Not Loading
1. Check browser console for errors
2. Verify Firestore security rules
3. Ensure collections are created (they auto-create on first write)

## 🌐 Production Deployment

For production deployment:

1. Set up environment variables instead of dev-config.tsx
2. Configure Firebase security rules
3. Set up custom domain in Firebase Hosting
4. Enable Firebase Analytics

## 📱 Features Enabled

- ✅ Real-time data synchronization
- ✅ Offline support with cache
- ✅ Admin authentication
- ✅ Contact form submissions
- ✅ Job application system
- ✅ Product and machinery management
- ✅ Customer data management

## 🆘 Need Help?

1. Visit [Firebase Documentation](https://firebase.google.com/docs/web/setup)
2. Check the `/firebase-setup` page in your app
3. Use the configuration helper form for easy setup

---

**Ready to launch?** Once Firebase is configured, your Cartify website will have a fully functional backend with real-time updates! 🎉
