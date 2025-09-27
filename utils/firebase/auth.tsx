// Firebase Authentication Utilities
import { 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword,
  User,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from './config';

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string | null;
  isAdmin?: boolean;
}

// Authentication service
export class AuthService {
  // Sign in with email and password
  async signIn(email: string, password: string): Promise<AuthUser | null> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return this.formatUser(result.user);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Create user with email and password
  async createUser(email: string, password: string, displayName: string): Promise<AuthUser | null> {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(result.user, {
        displayName: displayName
      });

      return this.formatUser(result.user);
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Set up auth state listener
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(auth, (user) => {
      callback(user ? this.formatUser(user) : null);
    });
  }

  // Get auth token
  async getAuthToken(): Promise<string | null> {
    const user = this.getCurrentUser();
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }

  // Check if user is admin (you can customize this logic)
  isAdmin(user: AuthUser | null): boolean {
    if (!user) return false;
    // For demo purposes, consider admin@cartify.com as admin
    // In production, you'd check user roles from Firestore
    return user.email === 'admin@cartify.com';
  }

  // Format user object
  private formatUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName,
      isAdmin: user.email === 'admin@cartify.com' // Simple admin check
    };
  }
}

// Export singleton instance
export const authService = new AuthService();

// Initialize admin user function (DISABLED for localStorage auth)
export async function initializeAdminUser(): Promise<void> {
  console.log('ℹ️ Firebase admin user initialization disabled - using localStorage authentication');
  console.log('ℹ️ Login credentials: admin@cartify.com / CartifyAdmin2024!');
  // This function is now disabled to prevent Firebase auth errors
  // since we're using the SimpleAuthContext with localStorage
  return;
}
