// Hybrid API - handles both online API calls and offline fallbacks seamlessly

import { CustomersAPI, ProductsAPI, MachineryAPI, JobsAPI, CompanyAPI, ContactsAPI, ApplicationsAPI, isAPIAvailable } from './api';
import { 
  getOfflineDataType, 
  saveOfflineDataType, 
  addOfflineItem, 
  updateOfflineItem, 
  deleteOfflineItem,
  initializeOfflineData 
} from './offlineDataManager';

// Initialize offline data on module load
initializeOfflineData();

// Hybrid Customers API
export const HybridCustomersAPI = {
  async getAll() {
    // Always use offline data for now to avoid fetch errors
    console.log('Using offline customers data');
    const offlineData = getOfflineDataType<any[]>('customers');
    return { data: offlineData, source: 'offline' };
  },

  async getAllAdmin() {
    // Always use offline data for now to avoid fetch errors
    console.log('Using offline customers admin data');
    const offlineData = getOfflineDataType<any[]>('customers');
    return { data: offlineData, source: 'offline' };
  },

  async create(customer: any) {
    // Create offline only for now
    console.log('Creating customer offline');
    const newCustomer = {
      ...customer,
      id: Date.now().toString(),
      status: 'active',
      createdAt: new Date().toISOString()
    };
    addOfflineItem('customers', newCustomer);
    return { data: newCustomer, source: 'offline' };
  },

  async update(id: string, customer: any) {
    // Update offline only for now
    console.log('Updating customer offline');
    updateOfflineItem('customers', id, customer);
    const offlineData = getOfflineDataType<any[]>('customers');
    const updated = offlineData.find(item => item.id === id);
    return { data: updated, source: 'offline' };
  },

  async delete(id: string) {
    // Delete offline only for now
    console.log('Deleting customer offline');
    deleteOfflineItem('customers', id);
    return { data: { success: true }, source: 'offline' };
  }
};

// Hybrid Products API
export const HybridProductsAPI = {
  async getAll() {
    console.log('Using offline products data');
    const offlineData = getOfflineDataType<any[]>('products');
    return { data: offlineData, source: 'offline' };
  },

  async getAllAdmin() {
    console.log('Using offline products admin data');
    const offlineData = getOfflineDataType<any[]>('products');
    return { data: offlineData, source: 'offline' };
  },

  async create(product: any) {
    console.log('Creating product offline');
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      status: 'active',
      createdAt: new Date().toISOString()
    };
    addOfflineItem('products', newProduct);
    return { data: newProduct, source: 'offline' };
  },

  async update(id: string, product: any) {
    console.log('Updating product offline');
    updateOfflineItem('products', id, product);
    const offlineData = getOfflineDataType<any[]>('products');
    const updated = offlineData.find(item => item.id === id);
    return { data: updated, source: 'offline' };
  },

  async delete(id: string) {
    console.log('Deleting product offline');
    deleteOfflineItem('products', id);
    return { data: { success: true }, source: 'offline' };
  }
};

// Hybrid Machinery API
export const HybridMachineryAPI = {
  async getAll() {
    try {
      const apiAvailable = await isAPIAvailable();
      if (apiAvailable) {
        const response = await MachineryAPI.getAll();
        if (response.data) {
          saveOfflineDataType('machinery', response.data);
          return { data: response.data, source: 'api' };
        }
      }
    } catch (error) {
      console.log('Machinery API failed, using offline data');
    }
    
    const offlineData = getOfflineDataType<any[]>('machinery');
    return { data: offlineData, source: 'offline' };
  },

  async getAllAdmin() {
    try {
      const apiAvailable = await isAPIAvailable();
      if (apiAvailable) {
        const response = await MachineryAPI.getAllAdmin();
        if (response.data) {
          saveOfflineDataType('machinery', response.data);
          return { data: response.data, source: 'api' };
        }
      }
    } catch (error) {
      console.log('Machinery Admin API failed, using offline data');
    }
    
    const offlineData = getOfflineDataType<any[]>('machinery');
    return { data: offlineData, source: 'offline' };
  },

  async create(machinery: any) {
    try {
      const apiAvailable = await isAPIAvailable();
      if (apiAvailable) {
        const response = await MachineryAPI.create(machinery);
        if (response.data) {
          addOfflineItem('machinery', response.data);
          return { data: response.data, source: 'api' };
        }
      }
    } catch (error) {
      console.log('Create machinery API failed, saving offline');
    }
    
    const newMachinery = {
      ...machinery,
      id: Date.now().toString(),
      status: 'active',
      createdAt: new Date().toISOString()
    };
    addOfflineItem('machinery', newMachinery);
    return { data: newMachinery, source: 'offline' };
  },

  async update(id: string, machinery: any) {
    try {
      const apiAvailable = await isAPIAvailable();
      if (apiAvailable) {
        const response = await MachineryAPI.update(id, machinery);
        if (response.data) {
          updateOfflineItem('machinery', id, response.data);
          return { data: response.data, source: 'api' };
        }
      }
    } catch (error) {
      console.log('Update machinery API failed, saving offline');
    }
    
    updateOfflineItem('machinery', id, machinery);
    const offlineData = getOfflineDataType<any[]>('machinery');
    const updated = offlineData.find(item => item.id === id);
    return { data: updated, source: 'offline' };
  },

  async delete(id: string) {
    try {
      const apiAvailable = await isAPIAvailable();
      if (apiAvailable) {
        const response = await MachineryAPI.delete(id);
        if (response.data || !response.error) {
          deleteOfflineItem('machinery', id);
          return { data: { success: true }, source: 'api' };
        }
      }
    } catch (error) {
      console.log('Delete machinery API failed, deleting offline');
    }
    
    deleteOfflineItem('machinery', id);
    return { data: { success: true }, source: 'offline' };
  }
};

// Hybrid Company API
export const HybridCompanyAPI = {
  async get() {
    console.log('Using offline company data');
    const offlineData = getOfflineDataType<any>('company');
    return { data: offlineData, source: 'offline' };
  },

  async getAdmin() {
    return this.get();
  },

  async update(data: any) {
    console.log('Updating company data offline');
    saveOfflineDataType('company', { ...data, updatedAt: new Date().toISOString() });
    const offlineData = getOfflineDataType<any>('company');
    return { data: offlineData, source: 'offline' };
  }
};

// Export all hybrid APIs
export const HybridAPI = {
  customers: HybridCustomersAPI,
  products: HybridProductsAPI,
  machinery: HybridMachineryAPI,
  company: HybridCompanyAPI
};
