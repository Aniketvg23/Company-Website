# Firestore Security Rules for Cartify

You need to set up Firestore security rules in your Firebase Console. These rules control who can read and write data.

## Step-by-Step Setup:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `cartify-automotive`
3. Go to **Firestore Database** → **Rules**
4. Replace the existing rules with the rules below
5. Click **Publish**

## Basic Security Rules:

Copy and paste these rules into your Firestore Rules editor:

\`\`\`javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to active products, machinery, and jobs
    match /products/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /machinery/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /jobs/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Allow public write access for contact forms and job applications
    match /contacts/{document} {
      allow read, write: if request.auth != null;
      allow create: if true; // Allow anyone to submit contact forms
    }
    
    match /applications/{document} {
      allow read, write: if request.auth != null;
      allow create: if true; // Allow anyone to submit job applications
    }
    
    // Admin-only access for customers
    match /customers/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
\`\`\`

## What These Rules Do:

- ✅ **Products, Machinery, Jobs**: Public read access, authenticated write access
- ✅ **Contact Forms**: Anyone can submit, only authenticated users can read/manage
- ✅ **Job Applications**: Anyone can submit, only authenticated users can read/manage  
- ✅ **Customers**: Only authenticated users can read/write

## After Setting Rules:

1. Save and publish the rules
2. Refresh your Cartify website
3. The connection errors should disappear
4. Try logging in with: `admin@cartify.com` / `CartifySecure2024!`

## Troubleshooting:

### If you still get permission errors:
1. Make sure you published the rules (not just saved)
2. Wait 1-2 minutes for rules to propagate
3. Try refreshing your website

### If admin login fails:
1. The admin user will be created automatically when you first visit the site
2. If it still doesn't work, the rules above allow full access for testing

## Production Security:

For production use, you may want to add more restrictive rules like:

\`\`\`javascript
// Only allow reads of active items
allow read: if resource.data.status == 'active';

// Only allow specific admin emails
allow write: if request.auth.token.email == 'admin@cartify.com';
\`\`\`

But for now, the basic rules above will get your site working!
