// Firestore Database Utilities
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';

export interface FirestoreDocument {
  id: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  status: string;
}

// Generic Firestore operations
export class FirestoreService<T extends Record<string, any>> {
  constructor(private collectionName: string) {}

  // Create a new document
  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const docRef = await addDoc(collection(db, this.collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      status: data.status || 'active'
    });
    
    const docSnap = await getDoc(docRef);
    return { id: docRef.id, ...docSnap.data() } as T;
  }

  // Get all documents
  async getAll(): Promise<T[]> {
    const querySnapshot = await getDocs(
      query(collection(db, this.collectionName), orderBy('createdAt', 'desc'))
    );
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  }

  // Get active documents only
  async getActive(): Promise<T[]> {
    const querySnapshot = await getDocs(
      query(
        collection(db, this.collectionName), 
        where('status', '==', 'active'), 
        orderBy('createdAt', 'desc')
      )
    );
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  }

  // Get document by ID
  async getById(id: string): Promise<T | null> {
    const docSnap = await getDoc(doc(db, this.collectionName, id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  }

  // Update document
  async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<T> {
    const docRef = doc(db, this.collectionName, id);
    
    // First check if the document exists
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error(`Document with ID ${id} not found in collection ${this.collectionName}. The document may have been deleted or the ID is incorrect.`);
    }
    
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    
    const updatedDocSnap = await getDoc(docRef);
    return { id: docRef.id, ...updatedDocSnap.data() } as T;
  }

  // Delete document
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, this.collectionName, id));
  }

  // Set up real-time listener
  onSnapshot(callback: (docs: T[]) => void, activeOnly: boolean = false): () => void {
    const q = activeOnly
      ? query(
          collection(db, this.collectionName), 
          where('status', '==', 'active'), 
          orderBy('createdAt', 'desc')
        )
      : query(collection(db, this.collectionName), orderBy('createdAt', 'desc'));

    return onSnapshot(q, 
      (querySnapshot) => {
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
        callback(docs);
      },
      (error) => {
        // Handle snapshot listener errors gracefully
        if (error.code === 'permission-denied') {
          console.log(`ℹ️ Real-time listener for ${this.collectionName} blocked by security rules - this is expected for new Firebase projects`);
          // Call callback with empty array to prevent broken state
          callback([]);
        } else {
          console.error(`❌ Real-time listener error for ${this.collectionName}:`, error);
          // For other errors, also call callback with empty array to maintain app stability
          callback([]);
        }
      }
    );
  }

  // Safe update that checks existence first
  async safeUpdate(id: string, data: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<T | null> {
    try {
      return await this.update(id, data);
    } catch (error: any) {
      if (error.message && error.message.includes('not found')) {
        console.warn(`Document ${id} not found in ${this.collectionName}, skipping update`);
        return null;
      }
      throw error;
    }
  }

  // Check if document exists
  async exists(id: string): Promise<boolean> {
    const docSnap = await getDoc(doc(db, this.collectionName, id));
    return docSnap.exists();
  }

  // Get documents by field value
  async getByField(field: string, value: any): Promise<T[]> {
    const querySnapshot = await getDocs(
      query(
        collection(db, this.collectionName), 
        where(field, '==', value), 
        orderBy('createdAt', 'desc')
      )
    );
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  }
}

// Specific document interfaces
export interface Product extends FirestoreDocument {
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  features: string[];
}

export interface Machinery extends FirestoreDocument {
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  specifications: string[];
  manufacturer: string;
  yearInstalled: string;
  capacity: string;
}

export interface Job extends FirestoreDocument {
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary: string;
}

export interface Contact extends FirestoreDocument {
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  message: string;
}

export interface Application extends FirestoreDocument {
  jobId: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  resume: string;
  coverLetter: string;
}

export interface Customer extends FirestoreDocument {
  name: string;
  logoUrl: string;
  industry: string;
  location: string;
  partnership: string;
  description: string;
}

export interface Company extends FirestoreDocument {
  name: string;
  tagline: string;
  logo: string;
  colors: {
    primary: string;
    secondary: string;
  };
  location?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
}

// Service instances
export const productsService = new FirestoreService<Product>('products');
export const machineryService = new FirestoreService<Machinery>('machinery');
export const jobsService = new FirestoreService<Job>('jobs');
export const contactsService = new FirestoreService<Contact>('contacts');
export const applicationsService = new FirestoreService<Application>('applications');
export const customersService = new FirestoreService<Customer>('customers');
export const companyService = new FirestoreService<Company>('company');
