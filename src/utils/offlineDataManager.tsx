// Offline Data Manager - handles local storage operations with better structure

export interface OfflineData {
  customers: any[];
  products: any[];
  machinery: any[];
  jobs: any[];
  company: any;
  contacts: any[];
  applications: any[];
  lastSync: string;
}

const STORAGE_KEY = 'cartify_offline_data';

// Initialize default data structure
const getDefaultData = (): OfflineData => ({
  customers: [
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
    }
  ],
  products: [
    {
      id: "1",
      name: "HDPE Carry Bags",
      description: "High-density polyethylene carry bags perfect for retail and grocery stores.",
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=300&fit=crop",
      category: "Retail Bags",
      features: ["Eco-friendly", "Tear resistant", "Multiple sizes"],
      status: "active",
      createdAt: new Date().toISOString()
    },
    {
      id: "2",
      name: "LDPE Packaging Films",
      description: "Low-density polyethylene films ideal for food packaging and industrial applications.",
      imageUrl: "https://images.unsplash.com/photo-1586953235919-d4e7fac1bd0b?w=500&h=300&fit=crop",
      category: "Industrial Films",
      features: ["Food grade", "Moisture barrier", "Flexible"],
      status: "active",
      createdAt: new Date().toISOString()
    }
  ],
  machinery: [
    {
      id: "1",
      name: "Blown Film Extrusion Line",
      description: "Advanced blown film extrusion system for producing high-quality polyethylene films.",
      imageUrl: "https://images.unsplash.com/photo-1701448149957-b96dbd1926ff?w=500&h=300&fit=crop",
      category: "Extrusion Equipment",
      specifications: ["Multi-layer co-extrusion capability", "Automatic thickness control"],
      manufacturer: "Macro Engineering",
      yearInstalled: "2022",
      capacity: "300 kg/hour",
      status: "active",
      createdAt: new Date().toISOString()
    }
  ],
  jobs: [
    {
      id: "1",
      title: "Production Manager",
      department: "Manufacturing",
      location: "Mumbai, India",
      type: "Full-time",
      experience: "5-8 years",
      description: "Lead our production team and oversee manufacturing operations.",
      requirements: ["Bachelor's degree in Engineering", "5+ years of manufacturing experience"],
      responsibilities: ["Oversee daily production operations", "Manage production team"],
      salary: "₹8-12 LPA",
      status: "active",
      createdAt: new Date().toISOString()
    }
  ],
  company: {
    logo: "https://images.unsplash.com/photo-1626417359455-2377907b1141?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb21wYW55JTIwbG9nbyUyMG9yYW5nZSUyMGF1dG9tb3RpdmUlMjBpbmR1c3RyaWFsfGVufDF8fHx8MTc1ODM5MjAxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    name: "Cartify Automotive Industries",
    tagline: "Leading manufacturer of high-quality industrial plastic bags",
    colors: {
      primary: "#FF8A00",
      secondary: "#E53E3E"
    }
  },
  contacts: [],
  applications: [],
  lastSync: new Date().toISOString()
});

// Get offline data
export function getOfflineData(): OfflineData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...getDefaultData(), ...JSON.parse(stored) };
    }
    return getDefaultData();
  } catch (error) {
    console.error('Error loading offline data:', error);
    return getDefaultData();
  }
}

// Save offline data
export function saveOfflineData(data: Partial<OfflineData>): void {
  try {
    const current = getOfflineData();
    const updated = { ...current, ...data, lastSync: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving offline data:', error);
  }
}

// Get specific data type
export function getOfflineDataType<T>(type: keyof OfflineData): T {
  const data = getOfflineData();
  return data[type] as T;
}

// Save specific data type
export function saveOfflineDataType<T>(type: keyof OfflineData, value: T): void {
  const current = getOfflineData();
  current[type] = value as any;
  saveOfflineData(current);
}

// Add item to array-based data
export function addOfflineItem(type: 'customers' | 'products' | 'machinery' | 'jobs' | 'contacts' | 'applications', item: any): void {
  const current = getOfflineDataType<any[]>(type);
  const updated = [...current, { ...item, id: item.id || Date.now().toString() }];
  saveOfflineDataType(type, updated);
}

// Update item in array-based data
export function updateOfflineItem(type: 'customers' | 'products' | 'machinery' | 'jobs' | 'contacts' | 'applications', id: string, updates: any): void {
  const current = getOfflineDataType<any[]>(type);
  const updated = current.map(item => item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item);
  saveOfflineDataType(type, updated);
}

// Delete item from array-based data
export function deleteOfflineItem(type: 'customers' | 'products' | 'machinery' | 'jobs' | 'contacts' | 'applications', id: string): void {
  const current = getOfflineDataType<any[]>(type);
  const updated = current.filter(item => item.id !== id);
  saveOfflineDataType(type, updated);
}

// Initialize offline data if not exists
export function initializeOfflineData(): void {
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    if (!current) {
      console.log('Initializing offline data with default values...');
      saveOfflineData(getDefaultData());
    } else {
      console.log('Offline data already exists - checking for updates...');
      // Check if company logo needs to be updated
      const existingData = JSON.parse(current);
      const defaultData = getDefaultData();
      
      // Update company logo if it's missing or empty
      if (!existingData.company?.logo) {
        console.log('Updating company logo...');
        existingData.company = {
          ...existingData.company,
          logo: defaultData.company.logo
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
      }
    }
  } catch (error) {
    console.error('Error initializing offline data:', error);
    // Fallback: try to save default data anyway
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(getDefaultData()));
    } catch (fallbackError) {
      console.error('Critical error: Cannot access localStorage:', fallbackError);
    }
  }
}

// Clear all offline data
export function clearOfflineData(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Get sync status
export function getLastSyncTime(): string {
  const data = getOfflineData();
  return data.lastSync;
}
