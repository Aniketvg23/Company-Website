// Real-time API Manager - handles backend operations with real-time updates
import { projectId, publicAnonKey } from './supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-55ec1098`;

interface RealtimeData {
  customers: any[];
  products: any[];
  machinery: any[];
  jobs: any[];
  company: any;
  contacts: any[];
  applications: any[];
  lastSync: string;
}

// Event listeners for real-time updates
type DataUpdateListener = (type: keyof RealtimeData, data: any[]) => void;
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

function notifyListeners(type: keyof RealtimeData, data: any[]) {
  listeners.forEach(listener => listener(type, data));
}

// Enhanced fetch with better error handling and timeout
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add auth header if available
  const accessToken = localStorage.getItem('supabase_access_token');
  if (accessToken) {
    defaultHeaders.Authorization = `Bearer ${accessToken}`;
  } else {
    defaultHeaders.Authorization = `Bearer ${publicAnonKey}`;
  }

  // Create timeout controller
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorText = 'Unknown error';
      try {
        errorText = await response.text();
      } catch (e) {
        // Ignore error reading response text
      }
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.log(`⏱️ API Timeout for ${endpoint} - backend may be unavailable`);
      throw new Error('Request timeout - backend may be unavailable');
    }
    
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.log(`🔌 Network error for ${endpoint} - backend server not running`);
      throw new Error('Network error - backend server is not accessible');
    }
    
    console.log(`ℹ️ API request to ${endpoint} failed:`, error);
    throw error;
  }
}

// Products API
export const productsAPI = {
  async getAll() {
    try {
      const products = await apiFetch('/admin/products');
      notifyListeners('products', products);
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async getPublic() {
    return await apiFetch('/products');
  },

  async create(productData: any) {
    const product = await apiFetch('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    
    // Refresh all products and notify listeners
    this.getAll();
    return product;
  },

  async update(id: string, updateData: any) {
    const product = await apiFetch(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    
    // Refresh all products and notify listeners
    this.getAll();
    return product;
  },

  async delete(id: string) {
    await apiFetch(`/admin/products/${id}`, {
      method: 'DELETE',
    });
    
    // Refresh all products and notify listeners
    this.getAll();
  },
};

// Machinery API
export const machineryAPI = {
  async getAll() {
    try {
      const machinery = await apiFetch('/admin/machinery');
      notifyListeners('machinery', machinery);
      return machinery;
    } catch (error) {
      console.error('Error fetching machinery:', error);
      throw error;
    }
  },

  async getPublic() {
    return await apiFetch('/machinery');
  },

  async create(machineryData: any) {
    const machinery = await apiFetch('/admin/machinery', {
      method: 'POST',
      body: JSON.stringify(machineryData),
    });
    
    // Refresh all machinery and notify listeners
    this.getAll();
    return machinery;
  },

  async update(id: string, updateData: any) {
    const machinery = await apiFetch(`/admin/machinery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    
    // Refresh all machinery and notify listeners
    this.getAll();
    return machinery;
  },

  async delete(id: string) {
    await apiFetch(`/admin/machinery/${id}`, {
      method: 'DELETE',
    });
    
    // Refresh all machinery and notify listeners
    this.getAll();
  },
};

// Jobs API
export const jobsAPI = {
  async getAll() {
    try {
      const jobs = await apiFetch('/admin/jobs');
      notifyListeners('jobs', jobs);
      return jobs;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  async getPublic() {
    return await apiFetch('/jobs');
  },

  async create(jobData: any) {
    const job = await apiFetch('/admin/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
    
    // Refresh all jobs and notify listeners
    this.getAll();
    return job;
  },

  async update(id: string, updateData: any) {
    const job = await apiFetch(`/admin/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    
    // Refresh all jobs and notify listeners
    this.getAll();
    return job;
  },

  async delete(id: string) {
    await apiFetch(`/admin/jobs/${id}`, {
      method: 'DELETE',
    });
    
    // Refresh all jobs and notify listeners
    this.getAll();
  },
};

// Contact forms API
export const contactsAPI = {
  async getAll() {
    try {
      const contacts = await apiFetch('/admin/contacts');
      notifyListeners('contacts', contacts);
      return contacts;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },

  async submit(contactData: any) {
    return await apiFetch('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },

  async updateStatus(id: string, status: string) {
    const contact = await apiFetch(`/admin/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    
    // Refresh all contacts and notify listeners
    this.getAll();
    return contact;
  },
};

// Applications API
export const applicationsAPI = {
  async getAll() {
    try {
      const applications = await apiFetch('/admin/applications');
      notifyListeners('applications', applications);
      return applications;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  },

  async submit(applicationData: any) {
    return await apiFetch('/careers/apply', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  },

  async updateStatus(id: string, status: string) {
    const application = await apiFetch(`/admin/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    
    // Refresh all applications and notify listeners
    this.getAll();
    return application;
  },
};

// Auth API
export const authAPI = {
  async initAdmin() {
    return await apiFetch('/init-admin', {
      method: 'POST',
    });
  },

  async signup(userData: any) {
    return await apiFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};

// Database initialization
export const databaseAPI = {
  async initialize() {
    return await apiFetch('/init-database', {
      method: 'POST',
    });
  },

  async health() {
    return await apiFetch('/health');
  },
};

// Data migration utility - migrate localStorage data to backend
export async function migrateLocalStorageToBackend() {
  try {
    console.log('Starting data migration from localStorage to backend...');
    
    // Get existing localStorage data
    const stored = localStorage.getItem('cartify_offline_data');
    if (!stored) {
      console.log('No localStorage data found to migrate');
      return;
    }

    const localData = JSON.parse(stored);
    let migrationResults = {
      products: { success: 0, failed: 0 },
      machinery: { success: 0, failed: 0 },
      jobs: { success: 0, failed: 0 },
    };

    // Migrate products
    if (localData.products && localData.products.length > 0) {
      for (const product of localData.products) {
        try {
          // Remove the old ID and let backend generate new one
          const { id, ...productData } = product;
          await productsAPI.create(productData);
          migrationResults.products.success++;
        } catch (error) {
          console.error('Failed to migrate product:', product, error);
          migrationResults.products.failed++;
        }
      }
    }

    // Migrate machinery
    if (localData.machinery && localData.machinery.length > 0) {
      for (const machine of localData.machinery) {
        try {
          const { id, ...machineryData } = machine;
          await machineryAPI.create(machineryData);
          migrationResults.machinery.success++;
        } catch (error) {
          console.error('Failed to migrate machinery:', machine, error);
          migrationResults.machinery.failed++;
        }
      }
    }

    // Migrate jobs
    if (localData.jobs && localData.jobs.length > 0) {
      for (const job of localData.jobs) {
        try {
          const { id, ...jobData } = job;
          await jobsAPI.create(jobData);
          migrationResults.jobs.success++;
        } catch (error) {
          console.error('Failed to migrate job:', job, error);
          migrationResults.jobs.failed++;
        }
      }
    }

    console.log('Migration completed:', migrationResults);
    
    // Backup localStorage data before clearing
    localStorage.setItem('cartify_offline_data_backup', stored);
    
    // Clear localStorage after successful migration
    const totalFailed = migrationResults.products.failed + 
                       migrationResults.machinery.failed + 
                       migrationResults.jobs.failed;
    
    if (totalFailed === 0) {
      localStorage.removeItem('cartify_offline_data');
      console.log('LocalStorage data cleared after successful migration');
    }

    return migrationResults;
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Real-time polling for updates
let pollingInterval: NodeJS.Timeout | null = null;

export function startRealTimePolling(intervalMs: number = 30000) {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }

  const pollData = async () => {
    try {
      // Only poll if user is authenticated
      const accessToken = localStorage.getItem('supabase_access_token');
      if (accessToken) {
        await Promise.all([
          productsAPI.getAll(),
          machineryAPI.getAll(),
          jobsAPI.getAll(),
          contactsAPI.getAll(),
          applicationsAPI.getAll(),
        ]);
      }
    } catch (error) {
      console.error('Polling error:', error);
    }
  };

  // Poll immediately
  pollData();
  
  // Set up interval
  pollingInterval = setInterval(pollData, intervalMs);
  console.log(`Real-time polling started with ${intervalMs}ms interval`);
}

export function stopRealTimePolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
    console.log('Real-time polling stopped');
  }
}

// Utility to check if backend is available with retry logic
export async function checkBackendHealth(retries = 1) {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await databaseAPI.health();
      console.log('✅ Backend server is online and healthy:', response);
      return true;
    } catch (error) {
      console.log(`🔍 Backend health check attempt ${i + 1}:`, error.message);
      
      if (i < retries) {
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 500));
        continue;
      }
      
      // Log final status
      if (error.message.includes('Network error') || error.message.includes('timeout')) {
        console.log('📡 Backend server is not running - switching to offline mode');
      } else {
        console.log('⚠️ Backend health check failed:', error.message);
      }
      
      return false;
    }
  }
  return false;
}
