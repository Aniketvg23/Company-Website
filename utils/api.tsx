import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-55ec1098`;

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  try {
    const authData = localStorage.getItem('cartify_admin_auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.access_token || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Check if we're in offline mode
let isOfflineMode = false;

// Generic API call function with offline fallback
async function apiCall<T = any>(
  endpoint: string, 
  options: RequestInit = {},
  requireAuth: boolean = false
): Promise<ApiResponse<T>> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (requireAuth) {
      const token = getAuthToken();
      if (!token) {
        return { error: 'Authentication required' };
      }
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      headers['Authorization'] = `Bearer ${publicAnonKey}`;
    }

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { 
        error: errorData.error || `HTTP ${response.status}: ${response.statusText}` 
      };
    }

    const data = await response.json();
    isOfflineMode = false; // Reset offline mode on successful call
    return { data };
  } catch (error: any) {
    console.error('API call error:', error);
    
    // Mark as offline if it's a network error
    if (error.name === 'TypeError' || error.name === 'AbortError') {
      isOfflineMode = true;
    }
    
    return { error: error.message || 'Network error occurred' };
  }
}

// Check if API is available
export async function isAPIAvailable(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.log('API not available:', error);
    return false;
  }
}

// Get offline mode status
export function getOfflineMode(): boolean {
  return isOfflineMode;
}

// Products API
export const ProductsAPI = {
  getAll: () => apiCall('/products'),
  getAllAdmin: () => apiCall('/admin/products', {}, true),
  create: (product: any) => apiCall('/admin/products', {
    method: 'POST',
    body: JSON.stringify(product)
  }, true),
  update: (id: string, product: any) => apiCall(`/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product)
  }, true),
  delete: (id: string) => apiCall(`/admin/products/${id}`, {
    method: 'DELETE'
  }, true),
};

// Machinery API
export const MachineryAPI = {
  getAll: () => apiCall('/machinery'),
  getAllAdmin: () => apiCall('/admin/machinery', {}, true),
  create: (machinery: any) => apiCall('/admin/machinery', {
    method: 'POST',
    body: JSON.stringify(machinery)
  }, true),
  update: (id: string, machinery: any) => apiCall(`/admin/machinery/${id}`, {
    method: 'PUT',
    body: JSON.stringify(machinery)
  }, true),
  delete: (id: string) => apiCall(`/admin/machinery/${id}`, {
    method: 'DELETE'
  }, true),
};

// Customers API
export const CustomersAPI = {
  getAll: () => apiCall('/customers'),
  getAllAdmin: () => apiCall('/admin/customers', {}, true),
  create: (customer: any) => apiCall('/admin/customers', {
    method: 'POST',
    body: JSON.stringify(customer)
  }, true),
  update: (id: string, customer: any) => apiCall(`/admin/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(customer)
  }, true),
  delete: (id: string) => apiCall(`/admin/customers/${id}`, {
    method: 'DELETE'
  }, true),
};

// Jobs API  
export const JobsAPI = {
  getAll: () => apiCall('/jobs'),
  getAllAdmin: () => apiCall('/admin/jobs', {}, true),
  create: (job: any) => apiCall('/admin/jobs', {
    method: 'POST',
    body: JSON.stringify(job)
  }, true),
  update: (id: string, job: any) => apiCall(`/admin/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(job)
  }, true),
  delete: (id: string) => apiCall(`/admin/jobs/${id}`, {
    method: 'DELETE'
  }, true),
};

// Careers API (alias for JobsAPI for easier usage)
export const CareersAPI = {
  getAllJobs: JobsAPI.getAll,
  getAllJobsAdmin: JobsAPI.getAllAdmin,
  createJob: JobsAPI.create,
  updateJob: JobsAPI.update,
  deleteJob: JobsAPI.delete,
};

// Contacts API
export const ContactsAPI = {
  submit: (contact: any) => apiCall('/contact', {
    method: 'POST',
    body: JSON.stringify(contact)
  }),
  getAllAdmin: () => apiCall('/admin/contacts', {}, true),
  updateStatus: (id: string, status: string) => apiCall(`/admin/contacts/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  }, true),
};

// Applications API
export const ApplicationsAPI = {
  submit: (application: any) => apiCall('/careers/apply', {
    method: 'POST',
    body: JSON.stringify(application)
  }),
  getAllAdmin: () => apiCall('/admin/applications', {}, true),
  updateStatus: (id: string, status: string) => apiCall(`/admin/applications/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  }, true),
};

// Company API
export const CompanyAPI = {
  get: () => apiCall('/company'),
  getAdmin: () => apiCall('/admin/company', {}, true),
  update: (data: any) => apiCall('/admin/company', {
    method: 'PUT',
    body: JSON.stringify(data)
  }, true),
};

// Admin API
export const AdminAPI = {
  getStats: () => apiCall('/admin/stats', {}, true),
  initDatabase: () => apiCall('/init-database', { method: 'POST' }),
  initAdmin: () => apiCall('/init-admin', { method: 'POST' }),
};
