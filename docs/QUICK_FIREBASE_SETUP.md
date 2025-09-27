# Quick Firebase Setup for Cartify Automotive Industries

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Project name: `cartify-automotive` 
4. Continue through setup (enable Google Analytics if desired)

## Step 2: Enable Required Services

### Authentication
1. In Firebase Console, go to **Authentication** → **Get started**
2. Go to **Sign-in method** tab
3. Enable **Email/Password** provider
4. Click **Save**

### Firestore Database
1. Go to **Firestore Database** → **Create database**
2. Select **Start in production mode**
3. Choose your preferred location (closest to your users)
4. Click **Done**

## Step 3: Add Web App

1. In Project Overview, click the **Web** icon (`</>`)
2. App nickname: `Cartify Website`
3. Click **Register app**
4. **Copy the configuration object** - you'll need these values next

## Step 4: Configure Your App

1. Open `/utils/firebase/dev-config.tsx` in your project
2. Replace the placeholder values with your actual Firebase config:

\`\`\`javascript
export const DEV_FIREBASE_CONFIG = {
  apiKey: "AIzaSyC...", // Your actual API key
  authDomain: "cartify-automotive.firebaseapp.com", // Your actual auth domain
  projectId: "cartify-automotive", // Your actual project ID
  storageBucket: "cartify-automotive.appspot.com", // Your actual storage bucket
  messagingSenderId: "123456789012", // Your actual sender ID
  appId: "1:123456789012:web:abcdef123456789abcdef", // Your actual app ID
};
\`\`\`

## Step 5: Test the Setup

1. Save the file
2. Refresh your website
3. The yellow setup banner should disappear
4. Connection status should show "Firebase Connected"
5. Go to `/admin` to test admin login

## Default Admin Credentials

- **Email:** admin@cartify.com
- **Password:** CartifySecure2024!

## Troubleshooting

### "API key not valid" Error
- Double-check your API key is copied correctly
- Make sure there are no extra spaces or characters

### "Project not found" Error  
- Verify your project ID matches exactly
- Ensure the project exists in Firebase Console

### Authentication Issues
- Confirm Email/Password is enabled in Authentication settings
- Check that the auth domain is correct

## Security Rules

The app will automatically configure basic Firestore security rules. For production use, review and customize these rules in the Firebase Console under **Firestore Database** → **Rules**.

## Need Help?

Visit `/firebase-setup` in your app for an interactive setup guide with detailed instructions.
