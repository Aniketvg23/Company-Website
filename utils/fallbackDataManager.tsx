// Fallback data manager for when backend is not available
// Uses localStorage as a simple fallback

interface FallbackData {
  products: any[];
  machinery: any[];
  jobs: any[];
  contacts: any[];
  applications: any[];
  lastSync: string;
}

const FALLBACK_STORAGE_KEY = 'cartify_fallback_data';

function getDefaultFallbackData(): FallbackData {
  return {
    products: [],
    machinery: [],
    jobs: [],
    contacts: [],
    applications: [],
    lastSync: new Date().toISOString()
  };
}

export function getFallbackData(): FallbackData {
  try {
    const stored = localStorage.getItem(FALLBACK_STORAGE_KEY);
    if (stored) {
      return { ...getDefaultFallbackData(), ...JSON.parse(stored) };
    }
    return getDefaultFallbackData();
  } catch (error) {
    console.error('Error loading fallback data:', error);
    return getDefaultFallbackData();
  }
}

export function saveFallbackData(data: Partial<FallbackData>): void {
  try {
    const current = getFallbackData();
    const updated = { ...current, ...data, lastSync: new Date().toISOString() };
    localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving fallback data:', error);
  }
}

export function getFallbackDataType<T>(type: keyof FallbackData): T {
  const data = getFallbackData();
  return data[type] as T;
}

export function saveFallbackDataType<T>(type: keyof FallbackData, value: T): void {
  const current = getFallbackData();
  current[type] = value as any;
  saveFallbackData(current);
}

// Simple CRUD operations for fallback mode
export const fallbackAPI = {
  // Products
  getProducts: () => getFallbackDataType<any[]>('products'),
  createProduct: (productData: any) => {
    const products = getFallbackDataType<any[]>('products');
    const newProduct = {
      id: `fallback_product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...productData,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    const updated = [...products, newProduct];
    saveFallbackDataType('products', updated);
    return newProduct;
  },
  updateProduct: (id: string, updateData: any) => {
    const products = getFallbackDataType<any[]>('products');
    const updated = products.map(item => 
      item.id === id ? { ...item, ...updateData, updatedAt: new Date().toISOString() } : item
    );
    saveFallbackDataType('products', updated);
    return updated.find(item => item.id === id);
  },
  deleteProduct: (id: string) => {
    const products = getFallbackDataType<any[]>('products');
    const updated = products.filter(item => item.id !== id);
    saveFallbackDataType('products', updated);
  },

  // Machinery
  getMachinery: () => getFallbackDataType<any[]>('machinery'),
  createMachine: (machineryData: any) => {
    const machinery = getFallbackDataType<any[]>('machinery');
    const newMachine = {
      id: `fallback_machinery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...machineryData,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    const updated = [...machinery, newMachine];
    saveFallbackDataType('machinery', updated);
    return newMachine;
  },
  updateMachine: (id: string, updateData: any) => {
    const machinery = getFallbackDataType<any[]>('machinery');
    const updated = machinery.map(item => 
      item.id === id ? { ...item, ...updateData, updatedAt: new Date().toISOString() } : item
    );
    saveFallbackDataType('machinery', updated);
    return updated.find(item => item.id === id);
  },
  deleteMachine: (id: string) => {
    const machinery = getFallbackDataType<any[]>('machinery');
    const updated = machinery.filter(item => item.id !== id);
    saveFallbackDataType('machinery', updated);
  },

  // Jobs
  getJobs: () => getFallbackDataType<any[]>('jobs'),
  createJob: (jobData: any) => {
    const jobs = getFallbackDataType<any[]>('jobs');
    const newJob = {
      id: `fallback_job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...jobData,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    const updated = [...jobs, newJob];
    saveFallbackDataType('jobs', updated);
    return newJob;
  },
  updateJob: (id: string, updateData: any) => {
    const jobs = getFallbackDataType<any[]>('jobs');
    const updated = jobs.map(item => 
      item.id === id ? { ...item, ...updateData, updatedAt: new Date().toISOString() } : item
    );
    saveFallbackDataType('jobs', updated);
    return updated.find(item => item.id === id);
  },
  deleteJob: (id: string) => {
    const jobs = getFallbackDataType<any[]>('jobs');
    const updated = jobs.filter(item => item.id !== id);
    saveFallbackDataType('jobs', updated);
  },

  // Initialize with sample data if empty
  initializeSampleData: () => {
    const data = getFallbackData();
    
    // Only initialize if everything is empty
    if (data.products.length === 0 && data.machinery.length === 0 && data.jobs.length === 0) {
      const sampleData = {
        products: [
          {
            id: 'sample_product_1',
            name: 'HDPE Carry Bags',
            description: 'High-density polyethylene carry bags perfect for retail and grocery stores.',
            category: 'Retail Bags',
            imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=300&fit=crop',
            features: ['Eco-friendly', 'Tear resistant', 'Multiple sizes'],
            status: 'active',
            createdAt: new Date().toISOString()
          },
          {
            id: 'sample_product_2',
            name: 'LDPE Packaging Films',
            description: 'Low-density polyethylene films ideal for food packaging and industrial applications.',
            category: 'Industrial Films',
            imageUrl: 'https://images.unsplash.com/photo-1586953235919-d4e7fac1bd0b?w=500&h=300&fit=crop',
            features: ['Food grade', 'Moisture barrier', 'Flexible'],
            status: 'active',
            createdAt: new Date().toISOString()
          },
          {
            id: 'sample_product_3',
            name: 'Biodegradable Shopping Bags',
            description: 'Environmentally friendly shopping bags made from biodegradable materials.',
            category: 'Eco-Friendly',
            imageUrl: 'https://images.unsplash.com/photo-1615719413546-198b25453f85?w=500&h=300&fit=crop',
            features: ['100% biodegradable', 'Compostable', 'Strong handles'],
            status: 'active',
            createdAt: new Date().toISOString()
          }
        ],
        machinery: [
          {
            id: 'sample_machinery_1',
            name: 'Blown Film Extrusion Line',
            description: 'Advanced blown film extrusion system for producing high-quality polyethylene films.',
            category: 'Extrusion Equipment',
            imageUrl: 'https://images.unsplash.com/photo-1701448149957-b96dbd1926ff?w=500&h=300&fit=crop',
            specifications: ['Multi-layer co-extrusion capability', 'Automatic thickness control'],
            manufacturer: 'Macro Engineering',
            yearInstalled: '2022',
            capacity: '300 kg/hour',
            status: 'active',
            createdAt: new Date().toISOString()
          }
        ],
        jobs: [
          {
            id: 'sample_job_1',
            title: 'Production Manager',
            department: 'Manufacturing',
            location: 'Mumbai, India',
            type: 'Full-time',
            experience: '5-8 years',
            description: 'Lead our production team and oversee manufacturing operations.',
            requirements: ['Bachelor\'s degree in Engineering', '5+ years of manufacturing experience'],
            responsibilities: ['Oversee daily production operations', 'Manage production team'],
            salary: '₹8-12 LPA',
            status: 'active',
            createdAt: new Date().toISOString()
          }
        ]
      };

      saveFallbackData(sampleData);
      console.log('✅ Fallback sample data initialized');
      return sampleData;
    }

    return data;
  }
};

export function clearFallbackData(): void {
  localStorage.removeItem(FALLBACK_STORAGE_KEY);
}
