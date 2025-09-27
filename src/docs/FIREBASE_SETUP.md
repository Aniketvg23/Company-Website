# Firebase Setup Guide

## Overview
Your Cartify application has been migrated from Supabase to Firebase. This guide will help you configure Firebase for your application.

## Environment Variables Required

Create a `.env` file in your project root with the following Firebase configuration:

\`\`\`env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
\`\`\`

## Setting Up Firebase Project

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Enter project name (e.g., "cartify-automotive")
   - Enable Google Analytics (optional)

2. **Enable Authentication**
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" sign-in method
   - The application will automatically create an admin user with:
     - Email: `admin@cartify.com`
     - Password: `CartifySecure2024!`

3. **Set up Firestore Database**
   - Go to Firestore Database
   - Click "Create database"
   - Choose "Start in production mode" or "Start in test mode" (for development)
   - Select a location for your database

4. **Configure Firestore Security Rules**
   \`\`\`javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow read access to all documents for authenticated users
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
       
       // Allow public read access to products, machinery, and jobs
       match /products/{document} {
         allow read: if true;
       }
       match /machinery/{document} {
         allow read: if true;
       }
       match /jobs/{document} {
         allow read: if true;
       }
       
       // Allow public write access to contacts and applications
       match /contacts/{document} {
         allow read, write: if true;
       }
       match /applications/{document} {
         allow read, write: if true;
       }
     }
   }
   \`\`\`

5. **Get Firebase Config**
   - Go to Project Settings > General
   - Scroll down to "Your apps"
   - Click on the web app icon (</>)
   - Copy the configuration values to your `.env` file

## Database Collections

The application uses the following Firestore collections:

- **products**: Product catalog data
- **machinery**: Industrial machinery information
- **jobs**: Job postings
- **contacts**: Contact form submissions
- **applications**: Job applications
- **customers**: Customer information

## Features

### Real-time Updates
- Firebase Firestore provides real-time updates automatically
- Changes to data are immediately reflected across all connected clients
- No polling required - uses WebSocket connections

### Authentication
- Firebase Authentication with email/password
- Admin user is automatically created on first run
- Secure token-based authentication

### Offline Support
- Application gracefully handles offline scenarios
- Falls back to localStorage when Firebase is unavailable
- Data migration tools available to sync offline data

## Admin Access

Default admin credentials:
- **Email**: admin@cartify.com
- **Password**: CartifySecure2024!

Access the admin panel at: `/admin`

## Migration from Supabase

If you have existing data in localStorage from the previous Supabase setup:

1. The application will automatically detect localStorage data
2. Use the migration tool in the admin panel to transfer data to Firebase
3. Data will be safely backed up before migration

## Development vs Production

### Development
- Uses Firebase configuration from environment variables
- Can optionally connect to Firebase emulators (commented out in config)
- Test mode Firestore rules for easier development

### Production
- Requires proper Firebase project with security rules
- Production-mode Firestore database
- Secure authentication configuration

## Troubleshooting

### Common Issues

1. **"Firebase not available"**
   - Check environment variables are set correctly
   - Verify Firebase project is active
   - Check network connectivity

2. **Authentication errors**
   - Ensure Email/Password auth is enabled in Firebase Console
   - Check if admin user was created successfully

3. **Firestore permission errors**
   - Review Firestore security rules
   - Ensure user is authenticated for protected operations

### Debug Information

The application logs detailed information to the browser console:
- Firebase connection status
- Authentication state
- Data loading progress
- Real-time update notifications

## Cost Considerations

Firebase offers generous free tiers:
- **Authentication**: 10,000 phone auths/month (email is unlimited)
- **Firestore**: 50K reads, 20K writes, 20K deletes per day
- **Storage**: 1GB storage, 10GB/month transfer

For production use, monitor usage in Firebase Console and upgrade to paid plans as needed.
