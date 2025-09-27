// Pure Offline API - NO network requests, completely localStorage-based

import { 
  getOfflineDataType, 
  saveOfflineDataType, 
  addOfflineItem, 
  updateOfflineItem, 
  deleteOfflineItem,
  initializeOfflineData 
} from './offlineDataManager';

// Initialize offline data immediately
initializeOfflineData();

// Pure Offline Customers API
export const PureOfflineCustomersAPI = {
  async getAllAdmin() {
    console.log('Loading customers from offline storage');
    const offlineData = getOfflineDataType<any[]>('customers');
    return { data: offlineData, source: 'offline' };
  },

  async getAll() {
    console.log('Loading public customers from offline storage');
    const offlineData = getOfflineDataType<any[]>('customers');
    return { data: offlineData, source: 'offline' };
  },

  async create(customer: any) {
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
    console.log('Updating customer offline');
    updateOfflineItem('customers', id, customer);
    const offlineData = getOfflineDataType<any[]>('customers');
    const updated = offlineData.find(item => item.id === id);
    return { data: updated, source: 'offline' };
  },

  async delete(id: string) {
    console.log('Deleting customer offline');
    deleteOfflineItem('customers', id);
    return { data: { success: true }, source: 'offline' };
  }
};

// Pure Offline Products API
export const PureOfflineProductsAPI = {
  async getAllAdmin() {
    console.log('Loading products from offline storage');
    const offlineData = getOfflineDataType<any[]>('products');
    return { data: offlineData, source: 'offline' };
  },

  async getAll() {
    console.log('Loading public products from offline storage');
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

// Pure Offline Machinery API
export const PureOfflineMachineryAPI = {
  async getAllAdmin() {
    console.log('Loading machinery from offline storage');
    const offlineData = getOfflineDataType<any[]>('machinery');
    return { data: offlineData, source: 'offline' };
  },

  async getAll() {
    console.log('Loading public machinery from offline storage');
    const offlineData = getOfflineDataType<any[]>('machinery');
    return { data: offlineData, source: 'offline' };
  },

  async create(machinery: any) {
    console.log('Creating machinery offline');
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
    console.log('Updating machinery offline');
    updateOfflineItem('machinery', id, machinery);
    const offlineData = getOfflineDataType<any[]>('machinery');
    const updated = offlineData.find(item => item.id === id);
    return { data: updated, source: 'offline' };
  },

  async delete(id: string) {
    console.log('Deleting machinery offline');
    deleteOfflineItem('machinery', id);
    return { data: { success: true }, source: 'offline' };
  }
};

// Pure Offline Company API
export const PureOfflineCompanyAPI = {
  async get() {
    console.log('Loading company data from offline storage');
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

// Pure Offline Jobs API
export const PureOfflineJobsAPI = {
  async getAllAdmin() {
    console.log('Loading jobs from offline storage');
    const offlineData = getOfflineDataType<any[]>('jobs');
    return { data: offlineData, source: 'offline' };
  },

  async getAll() {
    console.log('Loading public jobs from offline storage');
    const offlineData = getOfflineDataType<any[]>('jobs');
    return { data: offlineData, source: 'offline' };
  },

  async create(job: any) {
    console.log('Creating job offline');
    const newJob = {
      ...job,
      id: Date.now().toString(),
      status: 'active',
      createdAt: new Date().toISOString()
    };
    addOfflineItem('jobs', newJob);
    return { data: newJob, source: 'offline' };
  },

  async update(id: string, job: any) {
    console.log('Updating job offline');
    updateOfflineItem('jobs', id, job);
    const offlineData = getOfflineDataType<any[]>('jobs');
    const updated = offlineData.find(item => item.id === id);
    return { data: updated, source: 'offline' };
  },

  async delete(id: string) {
    console.log('Deleting job offline');
    deleteOfflineItem('jobs', id);
    return { data: { success: true }, source: 'offline' };
  }
};

// Pure Offline Applications API
export const PureOfflineApplicationsAPI = {
  async submit(application: any) {
    console.log('Submitting application offline');
    const newApplication = {
      ...application,
      id: Date.now().toString(),
      status: 'submitted',
      createdAt: new Date().toISOString()
    };
    addOfflineItem('applications', newApplication);
    return { data: newApplication, source: 'offline' };
  },

  async getAllAdmin() {
    console.log('Loading applications from offline storage');
    const offlineData = getOfflineDataType<any[]>('applications');
    return { data: offlineData, source: 'offline' };
  },

  async updateStatus(id: string, status: string) {
    console.log('Updating application status offline');
    updateOfflineItem('applications', id, { status });
    const offlineData = getOfflineDataType<any[]>('applications');
    const updated = offlineData.find(item => item.id === id);
    return { data: updated, source: 'offline' };
  }
};

// Export unified Pure Offline API
export const PureOfflineAPI = {
  customers: PureOfflineCustomersAPI,
  products: PureOfflineProductsAPI,
  machinery: PureOfflineMachineryAPI,
  company: PureOfflineCompanyAPI,
  jobs: PureOfflineJobsAPI,
  applications: PureOfflineApplicationsAPI
};
