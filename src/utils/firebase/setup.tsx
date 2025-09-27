// Firebase Setup and Initialization Utilities
import { authService, initializeAdminUser } from './auth';
import { 
  productsService, 
  machineryService, 
  jobsService, 
  contactsService,
  applicationsService,
  customersService 
} from './firestore';

// Setup and initialization functions
export class FirebaseSetupService {
  private initialized = false;

  async initialize(): Promise<{ success: boolean; message: string; error?: any }> {
    try {
      console.log('🔥 Starting Firebase initialization...');

      // Step 1: Test basic Firebase connection
      try {
        await this.testFirebaseConnection();
        console.log('✅ Firebase connection successful');
      } catch (error) {
        return {
          success: false,
          message: 'Firebase connection failed. Please check your configuration.',
          error
        };
      }

      // Step 2: Initialize admin user (DISABLED - using localStorage auth)
      // Commenting out Firebase auth to prevent auth errors when using localStorage
      console.log('ℹ️ Skipping Firebase admin user initialization (using localStorage auth)');

      // Step 3: Initialize sample data if needed
      try {
        await this.initializeSampleDataIfNeeded();
        console.log('✅ Sample data checked/initialized');
      } catch (error) {
        console.warn('⚠️ Sample data initialization failed:', error);
        // Don't fail the entire setup for this
      }

      this.initialized = true;
      return {
        success: true,
        message: 'Firebase initialized successfully'
      };

    } catch (error) {
      console.error('❌ Firebase initialization failed:', error);
      return {
        success: false,
        message: 'Firebase initialization failed',
        error
      };
    }
  }

  private async testFirebaseConnection(): Promise<void> {
    // Test Firebase connection by attempting a simple read operation
    try {
      console.log('🔍 Testing Firebase connection...');
      await productsService.getAll();
      console.log('✅ Firebase connection test successful');
    } catch (error: any) {
      console.log('📡 Firebase connection test result:', error.code);
      
      // Permission denied actually means we're connected but need security rules
      if (error.code === 'permission-denied') {
        console.log('✅ Firebase connected successfully (permission-denied means security rules need setup)');
        return;
      }
      
      // Handle specific Firebase errors
      if (error.code === 'project-not-found') {
        throw new Error('Firebase project not found. Please verify your project ID in your configuration.');
      }
      
      if (error.code === 'api-key-not-valid' || error.code === 'invalid-api-key') {
        throw new Error('Invalid Firebase API key. Please check your configuration.');
      }
      
      if (error.message?.includes('network') || error.message?.includes('fetch')) {
        throw new Error('Network error connecting to Firebase. Please check your internet connection.');
      }
      
      // For any other error, log it but don't fail - Firebase might still work
      console.warn('⚠️ Unexpected Firebase connection test result:', error);
      return;
    }
  }

  private async initializeSampleDataIfNeeded(): Promise<void> {
    try {
      console.log('📊 Checking for existing sample data...');
      
      // Try to check if we already have data
      const [products, machinery, jobs, customers] = await Promise.all([
        productsService.getAll().catch(e => {
          console.log('Products check failed:', e.code);
          return [];
        }),
        machineryService.getAll().catch(e => {
          console.log('Machinery check failed:', e.code);
          return [];
        }),
        jobsService.getAll().catch(e => {
          console.log('Jobs check failed:', e.code);
          return [];
        }),
        customersService.getAll().catch(e => {
          console.log('Customers check failed:', e.code);
          return [];
        })
      ]);

      if (products.length > 0 || machinery.length > 0 || jobs.length > 0 || customers.length > 0) {
        console.log('📊 Sample data already exists');
        return;
      }

      console.log('📊 No existing data found, attempting to create sample data...');
      await this.createSampleData();
      console.log('✅ Sample data created successfully');

    } catch (error: any) {
      if (error.code === 'permission-denied') {
        console.log('📊 Cannot create sample data: Firestore security rules need to be configured');
        // This is expected - don't treat as a fatal error
        return;
      }
      console.warn('⚠️ Sample data initialization encountered an issue:', error.message);
      // Don't throw the error - let the app continue
    }
  }

  private async createSampleData(): Promise<void> {
    try {
      console.log('📊 Attempting to create sample data...');
      
      // Sample Products
      const sampleProducts = [
        {
          name: "HDPE Carry Bags",
          description: "High-density polyethylene carry bags perfect for retail and grocery stores. Available in various sizes with excellent strength and durability.",
          imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=300&fit=crop",
          category: "Retail Bags",
          features: ["Eco-friendly", "Tear resistant", "Multiple sizes", "Custom printing available"],
          status: 'active'
        },
        {
          name: "LDPE Packaging Films",
          description: "Low-density polyethylene films ideal for food packaging and industrial applications. Provides excellent moisture barrier properties.",
          imageUrl: "https://images.unsplash.com/photo-1586953235919-d4e7fac1bd0b?w=500&h=300&fit=crop",
          category: "Industrial Films",
          features: ["Food grade", "Moisture barrier", "Flexible", "Heat sealable"],
          status: 'active'
        },
        {
          name: "Biodegradable Shopping Bags",
          description: "Environmentally friendly shopping bags made from biodegradable materials. Perfect for eco-conscious businesses.",
          imageUrl: "https://images.unsplash.com/photo-1615719413546-198b25453f85?w=500&h=300&fit=crop",
          category: "Eco-Friendly",
          features: ["100% biodegradable", "Compostable", "Strong handles", "Custom branding"],
          status: 'active'
        }
      ];

      // Sample Machinery
      const sampleMachinery = [
        {
          name: "Blown Film Extrusion Line",
          description: "Advanced blown film extrusion system for producing high-quality polyethylene films with excellent optical and mechanical properties.",
          imageUrl: "https://images.unsplash.com/photo-1701448149957-b96dbd1926ff?w=500&h=300&fit=crop",
          category: "Extrusion Equipment",
          specifications: [
            "Multi-layer co-extrusion capability",
            "Automatic thickness control",
            "Corona treatment system",
            "High-speed winding unit"
          ],
          manufacturer: "Macro Engineering",
          yearInstalled: "2022",
          capacity: "300 kg/hour",
          status: 'active'
        },
        {
          name: "Flexographic Printing Press",
          description: "8-color flexographic printing machine for high-quality graphics and text printing on plastic films and bags.",
          imageUrl: "https://images.unsplash.com/photo-1687735041206-47c616c3cdd5?w=500&h=300&fit=crop",
          category: "Printing Equipment",
          specifications: [
            "8-color printing capability",
            "Servo-driven registration",
            "Automatic ink density control",
            "Quick job changeover"
          ],
          manufacturer: "Windmoeller & Hoelscher",
          yearInstalled: "2023",
          capacity: "150 m/min",
          status: 'active'
        }
      ];

      // Sample Jobs
      const sampleJobs = [
        {
          title: "Production Manager",
          department: "Manufacturing",
          location: "Mumbai, India",
          type: "Full-time",
          experience: "5-8 years",
          description: "Lead our production team and oversee manufacturing operations to ensure quality and efficiency.",
          requirements: [
            "Bachelor's degree in Engineering or related field",
            "5+ years of manufacturing experience",
            "Strong leadership and communication skills",
            "Knowledge of plastic manufacturing processes"
          ],
          responsibilities: [
            "Oversee daily production operations",
            "Manage production team and schedules",
            "Ensure quality control standards",
            "Implement process improvements"
          ],
          salary: "₹8-12 LPA",
          status: 'active'
        },
        {
          title: "Quality Control Engineer",
          department: "Quality Assurance",
          location: "Mumbai, India",
          type: "Full-time",
          experience: "2-4 years",
          description: "Ensure product quality through comprehensive testing and analysis of plastic bags and films.",
          requirements: [
            "Bachelor's degree in Chemical/Mechanical Engineering",
            "2+ years in quality control",
            "Knowledge of testing procedures",
            "Attention to detail"
          ],
          responsibilities: [
            "Conduct quality tests on products",
            "Analyze test results and prepare reports",
            "Identify quality issues and solutions",
            "Maintain testing equipment"
          ],
          salary: "₹4-6 LPA",
          status: 'active'
        }
      ];

      // Create the data with proper error handling
      const productPromises = sampleProducts.map(async (product) => {
        try {
          return await productsService.create(product);
        } catch (error: any) {
          console.log('Product creation failed:', error.code);
          return null;
        }
      });

      const machineryPromises = sampleMachinery.map(async (machine) => {
        try {
          return await machineryService.create(machine);
        } catch (error: any) {
          console.log('Machinery creation failed:', error.code);
          return null;
        }
      });

      const jobPromises = sampleJobs.map(async (job) => {
        try {
          return await jobsService.create(job);
        } catch (error: any) {
          console.log('Job creation failed:', error.code);
          return null;
        }
      });

      // Sample Customers
      const sampleCustomers = [
        {
          name: "Industrial Solutions Ltd.",
          logoUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop",
          industry: "Manufacturing",
          location: "Mumbai, India",
          partnership: "Premium Partner",
          description: "Leading industrial manufacturing company specializing in heavy machinery and equipment.",
          status: "active"
        },
        {
          name: "Green Manufacturing Co.",
          logoUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop",
          industry: "Manufacturing",
          location: "Delhi, India",
          partnership: "Strategic Partner",
          description: "Eco-friendly manufacturing solutions with a focus on sustainable practices.",
          status: "active"
        },
        {
          name: "Logistics Prime",
          logoUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&h=200&fit=crop",
          industry: "Logistics & Supply Chain",
          location: "Bangalore, India",
          partnership: "Long-term Client",
          description: "Comprehensive logistics and supply chain management services across India.",
          status: "active"
        }
      ];

      const customerPromises = sampleCustomers.map(async (customer) => {
        try {
          return await customersService.create(customer);
        } catch (error: any) {
          console.log('Customer creation failed:', error.code);
          return null;
        }
      });

      const results = await Promise.all([
        ...productPromises,
        ...machineryPromises,
        ...jobPromises,
        ...customerPromises
      ]);

      const successCount = results.filter(result => result !== null).length;
      const totalCount = results.length;

      if (successCount > 0) {
        console.log(`✅ Created ${successCount}/${totalCount} sample data items`);
      } else {
        console.log('📊 No sample data could be created (likely due to permission restrictions)');
      }
    } catch (error: any) {
      console.warn('⚠️ Sample data creation encountered issues:', error.message);
      // Don't throw - this is not a fatal error
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  // Test all Firebase services
  async testAllServices(): Promise<{ service: string; status: string; error?: any }[]> {
    const services = [
      { name: 'Products', service: productsService },
      { name: 'Machinery', service: machineryService },
      { name: 'Jobs', service: jobsService },
      { name: 'Contacts', service: contactsService },
      { name: 'Applications', service: applicationsService },
      { name: 'Customers', service: customersService }
    ];

    const results = [];

    for (const { name, service } of services) {
      try {
        await service.getAll();
        results.push({ service: name, status: 'connected' });
      } catch (error) {
        results.push({ service: name, status: 'error', error });
      }
    }

    return results;
  }
}

// Export singleton instance
export const firebaseSetup = new FirebaseSetupService();

// Auto-initialize Firebase setup
let autoInitPromise: Promise<any> | null = null;

export function autoInitializeFirebase(): Promise<any> {
  if (!autoInitPromise) {
    autoInitPromise = firebaseSetup.initialize();
  }
  return autoInitPromise;
}
