// Firebase API Layer - replaces the old realtimeAPI
import {
  productsService,
  machineryService,
  jobsService,
  contactsService,
  applicationsService,
  customersService,
  companyService,
  Product,
  Machinery,
  Job,
  Contact,
  Application,
  Customer,
  Company
} from './firestore';
import { authService } from './auth';

// Event listeners for real-time updates
type DataUpdateListener = (type: string, data: any[]) => void;
const listeners: DataUpdateListener[] = [];

export function addDataUpdateListener(listener: DataUpdateListener) {
  listeners.push(listener);
}

export function removeDataUpdateListener(listener: DataUpdateListener) {
  const index = listeners.indexOf(listener);
  if (index > -1) {
    listeners.splice(index, 1);
  }
}

function notifyListeners(type: string, data: any[]) {
  listeners.forEach(listener => listener(type, data));
}

// Real-time listeners storage
const realtimeListeners: Map<string, () => void> = new Map();

// Products API
export const productsAPI = {
  async getAll(): Promise<Product[]> {
    try {
      const products = await productsService.getAll();
      notifyListeners('products', products);
      return products;
    } catch (error: any) {
      // Don't log permission-denied as an error - it's expected behavior
      if (error.code === 'permission-denied') {
        console.log('ℹ️ Products collection access denied - Firestore security rules needed');
      } else {
        console.error('Error fetching products:', error);
      }
      throw error;
    }
  },

  async getPublic(): Promise<Product[]> {
    try {
      return await productsService.getActive();
    } catch (error) {
      console.error('Error fetching public products:', error);
      throw error;
    }
  },

  async create(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    try {
      const product = await productsService.create(productData);
      // Refresh all products and notify listeners
      this.getAll();
      return product;
    } catch (error: any) {
      // Don't log permission-denied as an error - it's expected behavior
      if (error.code === 'permission-denied') {
        console.log('ℹ️ Product creation denied - Firestore security rules needed');
      } else {
        console.error('Error creating product:', error);
      }
      throw error;
    }
  },

  async update(id: string, updateData: Partial<Product>): Promise<Product> {
    try {
      const product = await productsService.update(id, updateData);
      // Refresh all products and notify listeners
      this.getAll();
      return product;
    } catch (error: any) {
      // Don't log permission-denied as an error - it's expected behavior
      if (error.code === 'permission-denied') {
        console.log('ℹ️ Product update denied - Firestore security rules needed');
      } else if (error.message && error.message.includes('not found')) {
        console.log(`ℹ️ Product ${id} not found in Firestore - syncing data...`);
        // Silently refresh the products list to sync with current state
        this.getAll();
      } else {
        console.error('Error updating product:', error);
      }
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    console.log('🔥 Firebase API: Attempting to delete product:', id);
    
    try {
      console.log('🔥 Firebase API: Calling Firestore delete...');
      await productsService.delete(id);
      console.log('✅ Firebase API: Firestore deletion successful');
      
      // Refresh all products and notify listeners with better error handling
      try {
        console.log('🔄 Firebase API: Fetching updated products list...');
        const updatedProducts = await this.getAll();
        console.log('✅ Firebase API: Successfully fetched updated products:', updatedProducts.length);
      } catch (refreshError: any) {
        // If refresh fails, try to at least update listeners manually
        console.log('⚠️ Firebase API: Auto-refresh after deletion failed:', refreshError.message);
        if (refreshError.code === 'permission-denied') {
          console.log('🔄 Firebase API: Triggering manual refresh due to permissions');
          // For permission issues, we need to trigger a manual refresh
          // Notify listeners with empty array to trigger a refresh attempt
          notifyListeners('products', []);
        }
      }
    } catch (error: any) {
      console.error('❌ Firebase API: Product deletion failed:', error);
      
      // Don't log permission-denied as an error - it's expected behavior
      if (error.code === 'permission-denied') {
        console.log('ℹ️ Product deletion denied - Firestore security rules needed');
      } else {
        console.error('Error deleting product:', error);
      }
      throw error;
    }
  },

  // Set up real-time listener
  startRealtimeUpdates(): void {
    if (realtimeListeners.has('products')) return;
    
    const unsubscribe = productsService.onSnapshot((products) => {
      notifyListeners('products', products);
    });
    realtimeListeners.set('products', unsubscribe);
  }
};

// Machinery API
export const machineryAPI = {
  async getAll(): Promise<Machinery[]> {
    try {
      const machinery = await machineryService.getAll();
      notifyListeners('machinery', machinery);
      return machinery;
    } catch (error: any) {
      // Don't log permission-denied as an error - it's expected behavior
      if (error.code === 'permission-denied') {
        console.log('ℹ️ Machinery collection access denied - Firestore security rules needed');
      } else {
        console.error('Error fetching machinery:', error);
      }
      throw error;
    }
  },

  async getPublic(): Promise<Machinery[]> {
    try {
      return await machineryService.getActive();
    } catch (error) {
      console.error('Error fetching public machinery:', error);
      throw error;
    }
  },

  async create(machineryData: Omit<Machinery, 'id' | 'createdAt' | 'updatedAt'>): Promise<Machinery> {
    try {
      const machinery = await machineryService.create(machineryData);
      this.getAll();
      return machinery;
    } catch (error) {
      console.error('Error creating machinery:', error);
      throw error;
    }
  },

  async update(id: string, updateData: Partial<Machinery>): Promise<Machinery> {
    try {
      const machinery = await machineryService.update(id, updateData);
      this.getAll();
      return machinery;
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        console.log('ℹ️ Machinery update denied - Firestore security rules needed');
      } else if (error.message && error.message.includes('not found')) {
        console.log(`ℹ️ Machinery ${id} not found in Firestore - syncing data...`);
        // Silently refresh the machinery list to sync with current state
        this.getAll();
      } else {
        console.error('Error updating machinery:', error);
      }
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await machineryService.delete(id);
      // Refresh all machinery and notify listeners with better error handling
      try {
        await this.getAll();
      } catch (refreshError: any) {
        // If refresh fails, try to at least update listeners manually
        console.log('ℹ️ Auto-refresh after machinery deletion failed, attempting manual state update');
        if (refreshError.code === 'permission-denied') {
          // For permission issues, we need to trigger a manual refresh
          // Notify listeners with empty array to trigger a refresh attempt
          notifyListeners('machinery', []);
        }
      }
    } catch (error) {
      console.error('Error deleting machinery:', error);
      throw error;
    }
  },

  startRealtimeUpdates(): void {
    if (realtimeListeners.has('machinery')) return;
    
    const unsubscribe = machineryService.onSnapshot((machinery) => {
      notifyListeners('machinery', machinery);
    });
    realtimeListeners.set('machinery', unsubscribe);
  }
};

// Jobs API
export const jobsAPI = {
  async getAll(): Promise<Job[]> {
    try {
      const jobs = await jobsService.getAll();
      notifyListeners('jobs', jobs);
      return jobs;
    } catch (error: any) {
      // Don't log permission-denied as an error - it's expected behavior
      if (error.code === 'permission-denied') {
        console.log('ℹ️ Jobs collection access denied - Firestore security rules needed');
      } else {
        console.error('Error fetching jobs:', error);
      }
      throw error;
    }
  },

  async getPublic(): Promise<Job[]> {
    try {
      return await jobsService.getActive();
    } catch (error) {
      console.error('Error fetching public jobs:', error);
      throw error;
    }
  },

  async create(jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job> {
    try {
      const job = await jobsService.create(jobData);
      this.getAll();
      return job;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  },

  async update(id: string, updateData: Partial<Job>): Promise<Job> {
    try {
      const job = await jobsService.update(id, updateData);
      this.getAll();
      return job;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await jobsService.delete(id);
      // Refresh all jobs and notify listeners with better error handling
      try {
        await this.getAll();
      } catch (refreshError: any) {
        // If refresh fails, try to at least update listeners manually
        console.log('ℹ️ Auto-refresh after job deletion failed, attempting manual state update');
        if (refreshError.code === 'permission-denied') {
          // For permission issues, we need to trigger a manual refresh
          // Notify listeners with empty array to trigger a refresh attempt
          notifyListeners('jobs', []);
        }
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  },

  startRealtimeUpdates(): void {
    if (realtimeListeners.has('jobs')) return;
    
    const unsubscribe = jobsService.onSnapshot((jobs) => {
      notifyListeners('jobs', jobs);
    });
    realtimeListeners.set('jobs', unsubscribe);
  }
};

// Contacts API
export const contactsAPI = {
  async getAll(): Promise<Contact[]> {
    try {
      const contacts = await contactsService.getAll();
      notifyListeners('contacts', contacts);
      return contacts;
    } catch (error: any) {
      // Don't log permission-denied as an error - it's expected behavior
      if (error.code === 'permission-denied') {
        console.log('ℹ️ Contacts collection access denied - Firestore security rules needed');
      } else {
        console.error('Error fetching contacts:', error);
      }
      throw error;
    }
  },

  async submit(contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
    try {
      return await contactsService.create({
        ...contactData,
        status: 'new'
      });
    } catch (error) {
      console.error('Error submitting contact:', error);
      throw error;
    }
  },

  async updateStatus(id: string, status: string): Promise<Contact> {
    try {
      const contact = await contactsService.update(id, { status });
      this.getAll();
      return contact;
    } catch (error) {
      console.error('Error updating contact status:', error);
      throw error;
    }
  },

  startRealtimeUpdates(): void {
    if (realtimeListeners.has('contacts')) return;
    
    const unsubscribe = contactsService.onSnapshot((contacts) => {
      notifyListeners('contacts', contacts);
    });
    realtimeListeners.set('contacts', unsubscribe);
  }
};

// Applications API
export const applicationsAPI = {
  async getAll(): Promise<Application[]> {
    try {
      const applications = await applicationsService.getAll();
      notifyListeners('applications', applications);
      return applications;
    } catch (error: any) {
      // Don't log permission-denied as an error - it's expected behavior
      if (error.code === 'permission-denied') {
        console.log('ℹ️ Applications collection access denied - Firestore security rules needed');
      } else {
        console.error('Error fetching applications:', error);
      }
      throw error;
    }
  },

  async submit(applicationData: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): Promise<Application> {
    try {
      return await applicationsService.create({
        ...applicationData,
        status: 'submitted'
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      throw error;
    }
  },

  async updateStatus(id: string, status: string): Promise<Application> {
    try {
      const application = await applicationsService.update(id, { status });
      this.getAll();
      return application;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },

  startRealtimeUpdates(): void {
    if (realtimeListeners.has('applications')) return;
    
    const unsubscribe = applicationsService.onSnapshot((applications) => {
      notifyListeners('applications', applications);
    });
    realtimeListeners.set('applications', unsubscribe);
  }
};

// Customers API
export const customersAPI = {
  async getAll(): Promise<Customer[]> {
    try {
      const customers = await customersService.getAll();
      notifyListeners('customers', customers);
      return customers;
    } catch (error: any) {
      // Don't log permission-denied as an error - it's expected behavior
      if (error.code === 'permission-denied') {
        console.log('ℹ️ Customers collection access denied - Firestore security rules needed');
      } else {
        console.error('Error fetching customers:', error);
      }
      throw error;
    }
  },

  async getPublic(): Promise<Customer[]> {
    try {
      return await customersService.getActive();
    } catch (error) {
      console.error('Error fetching public customers:', error);
      throw error;
    }
  },

  async create(customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    try {
      const customer = await customersService.create(customerData);
      // Refresh all customers and notify listeners
      this.getAll();
      return customer;
    } catch (error: any) {
      // Don't log permission-denied as an error - it's expected behavior
      if (error.code === 'permission-denied') {
        console.log('ℹ️ Customer creation denied - Firestore security rules needed');
      } else {
        console.error('Error creating customer:', error);
      }
      throw error;
    }
  },

  async update(id: string, updateData: Partial<Customer>): Promise<Customer> {
    try {
      const customer = await customersService.update(id, updateData);
      // Refresh all customers and notify listeners
      this.getAll();
      return customer;
    } catch (error: any) {
      // Don't log permission-denied as an error - it's expected behavior
      if (error.code === 'permission-denied') {
        console.log('ℹ️ Customer update denied - Firestore security rules needed');
      } else if (error.message && error.message.includes('not found')) {
        console.log(`ℹ️ Customer ${id} not found in Firestore - syncing data...`);
        // Silently refresh the customers list to sync with current state
        this.getAll();
      } else {
        console.error('Error updating customer:', error);
      }
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await customersService.delete(id);
      // Refresh all customers and notify listeners with better error handling
      try {
        await this.getAll();
      } catch (refreshError: any) {
        // If refresh fails, try to at least update listeners manually
        console.log('ℹ️ Auto-refresh after customer deletion failed, attempting manual state update');
        if (refreshError.code === 'permission-denied') {
          // For permission issues, we need to trigger a manual refresh
          // Notify listeners with empty array to trigger a refresh attempt
          notifyListeners('customers', []);
        }
      }
    } catch (error: any) {
      // Don't log permission-denied as an error - it's expected behavior
      if (error.code === 'permission-denied') {
        console.log('ℹ️ Customer deletion denied - Firestore security rules needed');
      } else {
        console.error('Error deleting customer:', error);
      }
      throw error;
    }
  },

  startRealtimeUpdates(): void {
    if (realtimeListeners.has('customers')) return;
    
    const unsubscribe = customersService.onSnapshot((customers) => {
      notifyListeners('customers', customers);
    });
    realtimeListeners.set('customers', unsubscribe);
  }
};

// Company API
export const companyAPI = {
  async get(): Promise<Company | null> {
    try {
      const companies = await companyService.getAll();
      if (companies.length > 0) {
        notifyListeners('company', companies[0]);
        return companies[0];
      }
      return null;
    } catch (error: any) {
      // Don't log permission-denied as an error - it's expected behavior
      if (error.code === 'permission-denied') {
        console.log('ℹ️ Company collection access denied - Firestore security rules needed');
      } else {
        console.error('Error fetching company:', error);
      }
      throw error;
    }
  },

  async createOrUpdate(companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Promise<Company> {
    try {
      // Check if a company document already exists
      const existingCompanies = await companyService.getAll();
      
      let company: Company;
      if (existingCompanies.length > 0) {
        // Update existing company
        company = await companyService.update(existingCompanies[0].id, companyData);
      } else {
        // Create new company
        company = await companyService.create(companyData);
      }
      
      // Notify listeners
      notifyListeners('company', company);
      return company;
    } catch (error: any) {
      // Don't log permission-denied as an error - it's expected behavior
      if (error.code === 'permission-denied') {
        console.log('ℹ️ Company update/creation denied - Firestore security rules needed');
      } else {
        console.error('Error updating company:', error);
      }
      throw error;
    }
  },

  startRealtimeUpdates(): void {
    if (realtimeListeners.has('company')) return;
    
    const unsubscribe = companyService.onSnapshot((companies) => {
      // Company is a singleton, so we pass the first company or null
      notifyListeners('company', companies.length > 0 ? companies[0] : null);
    });
    realtimeListeners.set('company', unsubscribe);
  }
};

// Database initialization using the new setup service
export const databaseAPI = {
  async initialize(): Promise<{ message: string; counts?: any }> {
    try {
      const { firebaseSetup } = await import('./setup');
      const result = await firebaseSetup.initialize();
      
      if (result.success) {
        // Get counts of data
        const [products, machinery, jobs, customers, company] = await Promise.all([
          productsService.getAll().catch(() => []),
          machineryService.getAll().catch(() => []),
          jobsService.getAll().catch(() => []),
          customersService.getAll().catch(() => []),
          companyService.getAll().catch(() => [])
        ]);

        return {
          message: result.message,
          counts: {
            products: products.length,
            machinery: machinery.length,
            jobs: jobs.length,
            customers: customers.length,
            company: company.length
          }
        };
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  },

  async health(): Promise<{ status: string; timestamp: string }> {
    try {
      const { firebaseSetup } = await import('./setup');
      const results = await firebaseSetup.testAllServices();
      
      const hasErrors = results.some(r => r.status === 'error');
      
      return {
        status: hasErrors ? 'degraded' : 'ok',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error('Firebase health check failed');
    }
  }
};

// Start real-time updates for all collections
export function startRealTimePolling(): void {
  console.log('🔄 Starting Firebase real-time listeners...');
  
  // Start listeners for each collection with error handling
  try {
    productsAPI.startRealtimeUpdates();
    console.log('✅ Products real-time listener started');
  } catch (error: any) {
    if (error.code !== 'permission-denied') {
      console.error('Failed to start products listener:', error);
    }
  }
  
  try {
    machineryAPI.startRealtimeUpdates();
    console.log('✅ Machinery real-time listener started');
  } catch (error: any) {
    if (error.code !== 'permission-denied') {
      console.error('Failed to start machinery listener:', error);
    }
  }
  
  try {
    jobsAPI.startRealtimeUpdates();
    console.log('✅ Jobs real-time listener started');
  } catch (error: any) {
    if (error.code !== 'permission-denied') {
      console.error('Failed to start jobs listener:', error);
    }
  }
  
  try {
    contactsAPI.startRealtimeUpdates();
    console.log('✅ Contacts real-time listener started');
  } catch (error: any) {
    if (error.code !== 'permission-denied') {
      console.error('Failed to start contacts listener:', error);
    }
  }
  
  try {
    applicationsAPI.startRealtimeUpdates();
    console.log('✅ Applications real-time listener started');
  } catch (error: any) {
    if (error.code !== 'permission-denied') {
      console.error('Failed to start applications listener:', error);
    }
  }
  
  try {
    customersAPI.startRealtimeUpdates();
    console.log('✅ Customers real-time listener started');
  } catch (error: any) {
    if (error.code !== 'permission-denied') {
      console.error('Failed to start customers listener:', error);
    }
  }
  
  try {
    companyAPI.startRealtimeUpdates();
    console.log('✅ Company real-time listener started');
  } catch (error: any) {
    if (error.code !== 'permission-denied') {
      console.error('Failed to start company listener:', error);
    }
  }
  
  console.log('🚀 Firebase real-time polling initialization completed');
}

export function stopRealTimePolling(): void {
  console.log('Stopping Firebase real-time listeners...');
  realtimeListeners.forEach((unsubscribe) => {
    unsubscribe();
  });
  realtimeListeners.clear();
}

// Initialize Firebase and clear any old offline data
export function initializeFirebaseMode(): void {
  try {
    // Clear any old localStorage data
    const keysToRemove = [
      'cartify_offline_data',
      'cartify_offline_data_backup', 
      'cartify_products',
      'cartify_machinery',
      'cartify_jobs',
      'cartify_contacts',
      'cartify_applications',
      'cartify_customers'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('🔥 Firebase-only mode initialized - offline data cleared');
  } catch (error) {
    console.error('Error initializing Firebase mode:', error);
  }
}
