// Real-time Data Context - Firebase-only real-time data management
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  addDataUpdateListener, 
  removeDataUpdateListener, 
  startRealTimePolling, 
  stopRealTimePolling,
  initializeFirebaseMode,
  productsAPI,
  machineryAPI,
  jobsAPI,
  contactsAPI,
  applicationsAPI,
  customersAPI,
  companyAPI,
  databaseAPI
} from '../utils/firebase/api';
import { StaleDataCleaner } from '../utils/firebase/staleDataCleaner';
import { ErrorFilter } from '../utils/firebase/errorFilter';

interface RealtimeDataState {
  products: any[];
  machinery: any[];
  jobs: any[];
  contacts: any[];
  applications: any[];
  customers: any[];
  company: any;
  loading: boolean;
  error: string | null;
  lastSync: string;
  isBackendAvailable: boolean;
}

interface RealtimeDataContextType extends RealtimeDataState {
  // Products
  createProduct: (productData: any) => Promise<any>;
  updateProduct: (id: string, updateData: any) => Promise<any>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Machinery
  createMachine: (machineryData: any) => Promise<any>;
  updateMachine: (id: string, updateData: any) => Promise<any>;
  deleteMachine: (id: string) => Promise<void>;
  
  // Jobs
  createJob: (jobData: any) => Promise<any>;
  updateJob: (id: string, updateData: any) => Promise<any>;
  deleteJob: (id: string) => Promise<void>;
  
  // Contacts
  submitContact: (contactData: any) => Promise<any>;
  updateContactStatus: (id: string, status: string) => Promise<any>;
  
  // Applications
  submitApplication: (applicationData: any) => Promise<any>;
  updateApplicationStatus: (id: string, status: string) => Promise<any>;
  
  // Customers
  createCustomer: (customerData: any) => Promise<any>;
  updateCustomer: (id: string, updateData: any) => Promise<any>;
  deleteCustomer: (id: string) => Promise<void>;
  
  // Company
  updateCompany: (companyData: any) => Promise<any>;
  
  // System
  refreshData: () => Promise<void>;
  initializeDatabase: () => Promise<any>;
  isBackendAvailable: boolean;
}

const RealtimeDataContext = createContext<RealtimeDataContextType | undefined>(undefined);

const defaultCustomers = [
  {
    id: "1",
    name: "Industrial Solutions Ltd.",
    logoUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop",
    industry: "Manufacturing",
    location: "Mumbai, India",
    partnership: "Premium Partner",
    description: "Leading industrial manufacturing company specializing in heavy machinery and equipment.",
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "Green Manufacturing Co.",
    logoUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop",
    industry: "Manufacturing",
    location: "Delhi, India",
    partnership: "Strategic Partner",
    description: "Eco-friendly manufacturing solutions with a focus on sustainable practices.",
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    name: "Logistics Prime",
    logoUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&h=200&fit=crop",
    industry: "Logistics & Supply Chain",
    location: "Bangalore, India",
    partnership: "Long-term Client",
    description: "Comprehensive logistics and supply chain management services across India.",
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    id: "4",
    name: "FoodTech Industries",
    logoUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
    industry: "Food & Beverage",
    location: "Chennai, India",
    partnership: "Key Account",
    description: "Food processing and packaging solutions for the modern food industry.",
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    id: "5",
    name: "AutoParts Express",
    logoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&h=200&fit=crop",
    industry: "Automotive",
    location: "Pune, India",
    partnership: "Regular Client",
    description: "Automotive parts manufacturing and distribution company.",
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    id: "6",
    name: "PharmaCare Solutions",
    logoUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop",
    industry: "Pharmaceutical",
    location: "Hyderabad, India",
    partnership: "Premium Partner",
    description: "Pharmaceutical packaging and storage solutions provider.",
    status: "active",
    createdAt: new Date().toISOString()
  }
];

const defaultCompany = {
  logo: "https://images.unsplash.com/photo-1626417359455-2377907b1141?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb21wYW55JTIwbG9nbyUyMG9yYW5nZSUyMGF1dG9tb3RpdmUlMjBpbmR1c3RyaWFsfGVufDF8fHx8MTc1ODM5MjAxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  name: "Cartify Automotive Industries",
  tagline: "Leading manufacturer of high-quality industrial plastic bags",
  colors: {
    primary: "#FF8A00",
    secondary: "#E53E3E"
  }
};

export function RealtimeDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RealtimeDataState>({
    products: [],
    machinery: [],
    jobs: [],
    contacts: [],
    applications: [],
    customers: defaultCustomers,
    company: defaultCompany,
    loading: false, // Start with false so routes load immediately
    error: null,
    lastSync: new Date().toISOString(),
    isBackendAvailable: false,
  });

  // Handle real-time data updates
  useEffect(() => {
    const handleDataUpdate = (type: keyof RealtimeDataState, data: any[]) => {
      setState(prev => ({
        ...prev,
        [type]: data,
        lastSync: new Date().toISOString(),
        error: null, // Clear errors on successful update
      }));
    };

    addDataUpdateListener(handleDataUpdate);
    return () => removeDataUpdateListener(handleDataUpdate);
  }, []);

  // Initialize Firebase and load data
  useEffect(() => {
    let mounted = true;

    const initializeData = async () => {
      try {
        // Don't set loading to true immediately - let routes load first
        setState(prev => ({ ...prev, error: null }));

        console.log('🔥 Initializing Firebase...');

        // Clear offline data and initialize Firebase-only mode
        initializeFirebaseMode();
        
        // Perform auto-cleanup of stale data
        StaleDataCleaner.performAutoCleanup();

        if (!mounted) return;

        try {
          // Skip Firebase auto-initialization since we're using localStorage auth
          console.log('ℹ️ Skipping Firebase setup auto-initialization (using localStorage auth)');
          console.log('📊 Proceeding with data loading without Firebase auth setup');
          // Continue without Firebase setup since auth is handled by localStorage

          // Attempt to load initial data (with graceful error handling)
          try {
            await refreshAllData();
            console.log('📊 Initial data loaded successfully');
            
            // If we reach here, backend is available
            setState(prev => ({ 
              ...prev, 
              loading: false,
              lastSync: new Date().toISOString(),
              error: null,
              isBackendAvailable: true
            }));
          } catch (dataError: any) {
            console.warn('⚠️ Initial data loading encountered issues:', dataError.message);
            
            // If it's permission denied, that's expected - set appropriate error but mark backend as available
            if (dataError.message.includes('permission-denied')) {
              setState(prev => ({ 
                ...prev, 
                loading: false,
                error: 'Firebase permission denied. Please check your Firestore security rules in /firebase-setup',
                isBackendAvailable: true // Firebase is connected, just needs rules
              }));
              return;
            } else {
              // Other errors mean backend is not available
              setState(prev => ({ 
                ...prev, 
                loading: false,
                error: dataError.message,
                isBackendAvailable: false
              }));
              return;
            }
          }
          
          // Start real-time listeners (these will also handle permission errors gracefully)
          startRealTimePolling();

          console.log('🚀 Firebase initialization completed');
        } catch (initError) {
          console.error('❌ Firebase initialization failed:', initError);
          
          let errorMessage = 'Firebase setup failed';
          if (initError instanceof Error) {
            if (initError.message.includes('api-key-not-valid') || initError.message.includes('API key not valid')) {
              errorMessage = 'Invalid Firebase API key. Please check your configuration in /firebase-setup';
            } else if (initError.message.includes('project-not-found') || initError.message.includes('Project not found')) {
              errorMessage = 'Firebase project not found. Please verify your project ID in /firebase-setup';
            } else if (initError.message.includes('permission-denied')) {
              errorMessage = 'Firebase permission denied. Please check your Firestore security rules in /firebase-setup';
            } else if (initError.message.includes('network')) {
              errorMessage = 'Network error. Please check your internet connection and try again';
            } else {
              errorMessage = `Firebase error: ${initError.message}`;
            }
          }
          
          setState(prev => ({ 
            ...prev, 
            loading: false,
            error: errorMessage
          }));
        }
      } catch (error) {
        console.error('⚠️ Data initialization failed:', error);
        if (mounted) {
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            error: error instanceof Error ? error.message : 'Unknown error'
          }));
        }
      }
    };

    initializeData();

    return () => {
      mounted = false;
      stopRealTimePolling();
    };
  }, []);

  const refreshAllData = async () => {
    console.log('🔄 Refreshing all data from Firebase...');
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Data fetch timeout: Firebase operations took too long')), 15000);
    });
    
    try {
      const dataFetchPromise = Promise.allSettled([
        productsAPI.getAll().catch(e => {
          console.log('Products fetch result:', e.code || e.message);
          if (e.code === 'permission-denied') {
            console.log('ℹ️ Products collection requires Firestore security rules - this is expected');
          }
          return [];
        }),
        machineryAPI.getAll().catch(e => {
          console.log('Machinery fetch result:', e.code || e.message);
          if (e.code === 'permission-denied') {
            console.log('ℹ️ Machinery collection requires Firestore security rules - this is expected');
          }
          return [];
        }),
        jobsAPI.getAll().catch(e => {
          console.log('Jobs fetch result:', e.code || e.message);
          if (e.code === 'permission-denied') {
            console.log('ℹ️ Jobs collection requires Firestore security rules - this is expected');
          }
          return [];
        }),
        contactsAPI.getAll().catch(e => {
          console.log('Contacts fetch result:', e.code || e.message);
          if (e.code === 'permission-denied') {
            console.log('ℹ️ Contacts collection requires Firestore security rules - this is expected');
          }
          return [];
        }),
        applicationsAPI.getAll().catch(e => {
          console.log('Applications fetch result:', e.code || e.message);
          if (e.code === 'permission-denied') {
            console.log('ℹ️ Applications collection requires Firestore security rules - this is expected');
          }
          return [];
        }),
        customersAPI.getAll().catch(e => {
          console.log('Customers fetch result:', e.code || e.message);
          if (e.code === 'permission-denied') {
            console.log('ℹ️ Customers collection requires Firestore security rules - this is expected');
          }
          return [];
        }),
        companyAPI.get().catch(e => {
          console.log('Company fetch result:', e.code || e.message);
          if (e.code === 'permission-denied') {
            console.log('ℹ️ Company collection requires Firestore security rules - this is expected');
          }
          return null;
        }),
      ]);

      const results = await Promise.race([dataFetchPromise, timeoutPromise]);

    // Check if any succeeded
    const successfulFetches = results.filter(result => result.status === 'fulfilled').length;
    const rejectedResults = results.filter(result => result.status === 'rejected');
    
    console.log(`📊 Data refresh completed: ${successfulFetches}/7 collections accessible`);
    
    // Extract successful data and update state
    const [productsResult, machineryResult, jobsResult, contactsResult, applicationsResult, customersResult, companyResult] = results;
    
    // Update state with successfully fetched data
    setState(prev => ({
      ...prev,
      products: productsResult.status === 'fulfilled' ? productsResult.value : prev.products,
      machinery: machineryResult.status === 'fulfilled' ? machineryResult.value : prev.machinery,
      jobs: jobsResult.status === 'fulfilled' ? jobsResult.value : prev.jobs,
      contacts: contactsResult.status === 'fulfilled' ? contactsResult.value : prev.contacts,
      applications: applicationsResult.status === 'fulfilled' ? applicationsResult.value : prev.applications,
      customers: customersResult.status === 'fulfilled' ? customersResult.value : prev.customers,
      company: companyResult.status === 'fulfilled' ? companyResult.value || prev.company : prev.company,
      lastSync: new Date().toISOString()
    }));
    
    if (successfulFetches === 0 && rejectedResults.length > 0) {
      // All failed - check if it's permission issues (expected for new Firebase projects)
      const firstError = rejectedResults[0].reason;
      if (firstError && (firstError.code === 'permission-denied' || firstError.message?.includes('permission-denied'))) {
        console.log('ℹ️ All collections are blocked by Firestore security rules - this is normal for new Firebase projects');
        throw new Error('permission-denied: Firestore security rules need to be configured');
      }
      
      // Other types of errors
      const errorMessage = firstError?.message || 'Unable to fetch data from Firebase';
      console.error('❌ Unexpected error during data fetch:', errorMessage);
      throw new Error(errorMessage);
    }
    
    // If some succeeded, log success
    if (successfulFetches > 0) {
      console.log(`✅ Successfully loaded ${successfulFetches} collections with data:`, {
        products: productsResult.status === 'fulfilled' ? productsResult.value.length : 0,
        machinery: machineryResult.status === 'fulfilled' ? machineryResult.value.length : 0,
        jobs: jobsResult.status === 'fulfilled' ? jobsResult.value.length : 0,
        contacts: contactsResult.status === 'fulfilled' ? contactsResult.value.length : 0,
        applications: applicationsResult.status === 'fulfilled' ? applicationsResult.value.length : 0,
        customers: customersResult.status === 'fulfilled' ? customersResult.value.length : 0,
        company: companyResult.status === 'fulfilled' ? (companyResult.value ? 1 : 0) : 0
      });
    }
    } catch (timeoutError: any) {
      console.warn('⏰ Data fetch timed out:', timeoutError.message);
      throw new Error('Firebase operations timed out. Please check your connection and Firebase configuration.');
    }
  };

  const refreshData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await refreshAllData();
      setState(prev => ({ 
        ...prev, 
        loading: false,
        lastSync: new Date().toISOString(),
        error: null
      }));
      console.log('✅ Data refresh completed successfully');
    } catch (error: any) {
      ErrorFilter.logError(error, 'Data Refresh');
      
      // Only show error to user if it's important
      const userMessage = ErrorFilter.getUserMessage(error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: userMessage || null
      }));
    }
  };

  const initializeDatabase = async () => {
    try {
      const result = await databaseAPI.initialize();
      await refreshData();
      return result;
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  };

  // Product operations
  const createProduct = async (productData: any) => {
    try {
      const result = await productsAPI.create(productData);
      return result;
    } catch (error: any) {
      // Handle permission-denied errors gracefully
      if (error.code === 'permission-denied') {
        const permissionError = 'Permission denied: Firestore security rules need to be configured to allow product creation. Please visit /firebase-setup to configure your security rules.';
        setState(prev => ({ ...prev, error: permissionError }));
        throw new Error(permissionError);
      } else {
        setState(prev => ({ ...prev, error: 'Failed to create product' }));
        throw error;
      }
    }
  };

  const updateProduct = async (id: string, updateData: any) => {
    try {
      const result = await productsAPI.update(id, updateData);
      return result;
    } catch (error: any) {
      // Handle permission-denied errors gracefully
      if (error.code === 'permission-denied') {
        const permissionError = 'Permission denied: Firestore security rules need to be configured to allow product updates. Please visit /firebase-setup to configure your security rules.';
        setState(prev => ({ ...prev, error: permissionError }));
        throw new Error(permissionError);
      } else if (error.message && error.message.includes('not found')) {
        console.log(`ℹ️ Product update skipped - item no longer exists in database`);
        // Silently refresh data to sync current state, don't show error to user
        setTimeout(() => refreshData(), 500);
        // Return a resolved promise to avoid breaking the UI flow
        return Promise.resolve(null);
      } else {
        const genericError = `Failed to update product: ${error.message || 'Unknown error'}`;
        setState(prev => ({ ...prev, error: genericError }));
        throw new Error(genericError);
      }
    }
  };

  const deleteProduct = async (id: string) => {
    console.log('🗑️ STARTING PRODUCT DELETION:', id);
    console.log('📊 Current products count before deletion:', state.products.length);
    
    try {
      console.log('🔥 Calling Firebase delete...');
      await productsAPI.delete(id);
      console.log('✅ Firebase deletion successful');
      
      // Immediately update local state to remove the product
      setState(prev => {
        const updatedProducts = prev.products.filter(p => p.id !== id);
        console.log('📊 Updated products count after local removal:', updatedProducts.length);
        return {
          ...prev,
          products: updatedProducts,
          lastSync: new Date().toISOString()
        };
      });
      
      // Also force a refresh after successful deletion to ensure sync
      setTimeout(() => {
        console.log('🔄 Running post-deletion refresh...');
        refreshData().catch(err => {
          console.log('ℹ️ Post-deletion refresh skipped due to:', err.message);
        });
      }, 1000);
      
    } catch (error: any) {
      console.error('❌ Product deletion failed:', error);
      
      // Handle permission-denied errors gracefully
      if (error.code === 'permission-denied') {
        const permissionError = 'Permission denied: Firestore security rules need to be configured to allow product deletion. Please visit /firebase-setup to configure your security rules.';
        setState(prev => ({ ...prev, error: permissionError }));
        throw new Error(permissionError);
      } else {
        setState(prev => ({ ...prev, error: 'Failed to delete product' }));
        throw error;
      }
    }
  };

  // Machinery operations
  const createMachine = async (machineryData: any) => {
    try {
      const result = await machineryAPI.create(machineryData);
      return result;
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        const permissionError = 'Permission denied: Firestore security rules need to be configured to allow machinery creation. Please visit /firebase-setup to configure your security rules.';
        setState(prev => ({ ...prev, error: permissionError }));
        throw new Error(permissionError);
      } else {
        setState(prev => ({ ...prev, error: 'Failed to create machinery' }));
        throw error;
      }
    }
  };

  const updateMachine = async (id: string, updateData: any) => {
    try {
      const result = await machineryAPI.update(id, updateData);
      return result;
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        const permissionError = 'Permission denied: Firestore security rules need to be configured to allow machinery updates. Please visit /firebase-setup to configure your security rules.';
        setState(prev => ({ ...prev, error: permissionError }));
        throw new Error(permissionError);
      } else if (error.message && error.message.includes('not found')) {
        console.log(`ℹ️ Machinery update skipped - item no longer exists in database`);
        // Silently refresh data to sync current state, don't show error to user
        setTimeout(() => refreshData(), 500);
        // Return a resolved promise to avoid breaking the UI flow
        return Promise.resolve(null);
      } else {
        const genericError = `Failed to update machinery: ${error.message || 'Unknown error'}`;
        setState(prev => ({ ...prev, error: genericError }));
        throw new Error(genericError);
      }
    }
  };

  const deleteMachine = async (id: string) => {
    try {
      await machineryAPI.delete(id);
      // Immediately update local state to remove the machine
      setState(prev => ({
        ...prev,
        machinery: prev.machinery.filter(m => m.id !== id),
        lastSync: new Date().toISOString()
      }));
      // Force a refresh after successful deletion to ensure UI updates
      setTimeout(() => {
        refreshData().catch(err => {
          console.log('ℹ️ Post-deletion refresh skipped due to:', err.message);
        });
      }, 500);
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        const permissionError = 'Permission denied: Firestore security rules need to be configured to allow machinery deletion. Please visit /firebase-setup to configure your security rules.';
        setState(prev => ({ ...prev, error: permissionError }));
        throw new Error(permissionError);
      } else {
        setState(prev => ({ ...prev, error: 'Failed to delete machinery' }));
        throw error;
      }
    }
  };

  // Job operations
  const createJob = async (jobData: any) => {
    try {
      const result = await jobsAPI.create(jobData);
      return result;
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        const permissionError = 'Permission denied: Firestore security rules need to be configured to allow job creation. Please visit /firebase-setup to configure your security rules.';
        setState(prev => ({ ...prev, error: permissionError }));
        throw new Error(permissionError);
      } else {
        setState(prev => ({ ...prev, error: 'Failed to create job' }));
        throw error;
      }
    }
  };

  const updateJob = async (id: string, updateData: any) => {
    try {
      const result = await jobsAPI.update(id, updateData);
      return result;
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        const permissionError = 'Permission denied: Firestore security rules need to be configured to allow job updates. Please visit /firebase-setup to configure your security rules.';
        setState(prev => ({ ...prev, error: permissionError }));
        throw new Error(permissionError);
      } else {
        setState(prev => ({ ...prev, error: 'Failed to update job' }));
        throw error;
      }
    }
  };

  const deleteJob = async (id: string) => {
    try {
      await jobsAPI.delete(id);
      // Immediately update local state to remove the job
      setState(prev => ({
        ...prev,
        jobs: prev.jobs.filter(j => j.id !== id),
        lastSync: new Date().toISOString()
      }));
      // Force a refresh after successful deletion to ensure UI updates
      setTimeout(() => {
        refreshData().catch(err => {
          console.log('ℹ️ Post-deletion refresh skipped due to:', err.message);
        });
      }, 500);
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        const permissionError = 'Permission denied: Firestore security rules need to be configured to allow job deletion. Please visit /firebase-setup to configure your security rules.';
        setState(prev => ({ ...prev, error: permissionError }));
        throw new Error(permissionError);
      } else {
        setState(prev => ({ ...prev, error: 'Failed to delete job' }));
        throw error;
      }
    }
  };

  // Contact operations
  const submitContact = async (contactData: any) => {
    try {
      const result = await contactsAPI.submit(contactData);
      return result;
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        const permissionError = 'Permission denied: Firestore security rules need to be configured to allow contact form submissions. Please visit /firebase-setup to configure your security rules.';
        setState(prev => ({ ...prev, error: permissionError }));
        throw new Error(permissionError);
      } else {
        setState(prev => ({ ...prev, error: 'Failed to submit contact form' }));
        throw error;
      }
    }
  };

  const updateContactStatus = async (id: string, status: string) => {
    try {
      const result = await contactsAPI.updateStatus(id, status);
      return result;
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        const permissionError = 'Permission denied: Firestore security rules need to be configured to allow contact status updates. Please visit /firebase-setup to configure your security rules.';
        setState(prev => ({ ...prev, error: permissionError }));
        throw new Error(permissionError);
      } else {
        setState(prev => ({ ...prev, error: 'Failed to update contact status' }));
        throw error;
      }
    }
  };

  // Application operations
  const submitApplication = async (applicationData: any) => {
    try {
      const result = await applicationsAPI.submit(applicationData);
      return result;
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        const permissionError = 'Permission denied: Firestore security rules need to be configured to allow job application submissions. Please visit /firebase-setup to configure your security rules.';
        setState(prev => ({ ...prev, error: permissionError }));
        throw new Error(permissionError);
      } else {
        setState(prev => ({ ...prev, error: 'Failed to submit application' }));
        throw error;
      }
    }
  };

  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      const result = await applicationsAPI.updateStatus(id, status);
      return result;
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        const permissionError = 'Permission denied: Firestore security rules need to be configured to allow application status updates. Please visit /firebase-setup to configure your security rules.';
        setState(prev => ({ ...prev, error: permissionError }));
        throw new Error(permissionError);
      } else {
        setState(prev => ({ ...prev, error: 'Failed to update application status' }));
        throw error;
      }
    }
  };

  // Customer operations
  const createCustomer = async (customerData: any) => {
    try {
      const result = await customersAPI.create(customerData);
      return result;
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        const permissionError = 'Permission denied: Firestore security rules need to be configured to allow customer creation. Please visit /firebase-setup to configure your security rules.';
        setState(prev => ({ ...prev, error: permissionError }));
        throw new Error(permissionError);
      } else {
        setState(prev => ({ ...prev, error: 'Failed to create customer' }));
        throw error;
      }
    }
  };

  const updateCustomer = async (id: string, updateData: any) => {
    try {
      const result = await customersAPI.update(id, updateData);
      return result;
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        const permissionError = 'Permission denied: Firestore security rules need to be configured to allow customer updates. Please visit /firebase-setup to configure your security rules.';
        setState(prev => ({ ...prev, error: permissionError }));
        throw new Error(permissionError);
      } else if (error.message && error.message.includes('not found')) {
        console.log(`ℹ️ Customer update skipped - item no longer exists in database`);
        // Silently refresh data to sync current state, don't show error to user
        setTimeout(() => refreshData(), 500);
        // Return a resolved promise to avoid breaking the UI flow
        return Promise.resolve(null);
      } else {
        const genericError = `Failed to update customer: ${error.message || 'Unknown error'}`;
        setState(prev => ({ ...prev, error: genericError }));
        throw new Error(genericError);
      }
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      await customersAPI.delete(id);
      // Immediately update local state to remove the customer
      setState(prev => ({
        ...prev,
        customers: prev.customers.filter(c => c.id !== id),
        lastSync: new Date().toISOString()
      }));
      // Force a refresh after successful deletion to ensure UI updates
      setTimeout(() => {
        refreshData().catch(err => {
          console.log('ℹ️ Post-deletion refresh skipped due to:', err.message);
        });
      }, 500);
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        const permissionError = 'Permission denied: Firestore security rules need to be configured to allow customer deletion. Please visit /firebase-setup to configure your security rules.';
        setState(prev => ({ ...prev, error: permissionError }));
        throw new Error(permissionError);
      } else {
        setState(prev => ({ ...prev, error: 'Failed to delete customer' }));
        throw error;
      }
    }
  };

  const contextValue: RealtimeDataContextType = {
    ...state,
    createProduct,
    updateProduct,
    deleteProduct,
    createMachine,
    updateMachine,
    deleteMachine,
    createJob,
    updateJob,
    deleteJob,
    submitContact,
    updateContactStatus,
    submitApplication,
    updateApplicationStatus,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    refreshData,
    initializeDatabase,
    isBackendAvailable: state.isBackendAvailable,
  };

  return (
    <RealtimeDataContext.Provider value={contextValue}>
      {children}
    </RealtimeDataContext.Provider>
  );
}

export function useRealtimeData() {
  const context = useContext(RealtimeDataContext);
  if (context === undefined) {
    throw new Error('useRealtimeData must be used within a RealtimeDataProvider');
  }
  return context;
}
