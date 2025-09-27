// Customer initialization utility for Firebase
import { customersService } from './firebase/firestore';

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
  },
  {
    name: "FoodTech Industries",
    logoUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
    industry: "Food & Beverage",
    location: "Chennai, India",
    partnership: "Key Account",
    description: "Food processing and packaging solutions for the modern food industry.",
    status: "active"
  },
  {
    name: "AutoParts Express",
    logoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&h=200&fit=crop",
    industry: "Automotive",
    location: "Pune, India",
    partnership: "Regular Client",
    description: "Automotive parts manufacturing and distribution company.",
    status: "active"
  },
  {
    name: "PharmaCare Solutions",
    logoUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop",
    industry: "Pharmaceutical",
    location: "Hyderabad, India",
    partnership: "Premium Partner",
    description: "Pharmaceutical packaging and storage solutions provider.",
    status: "active"
  },
  {
    name: "TechFlow Systems",
    logoUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=200&h=200&fit=crop",
    industry: "Electronics",
    location: "Hyderabad, India",
    partnership: "Strategic Partner",
    description: "Advanced technology solutions for industrial automation and electronics manufacturing.",
    status: "active"
  },
  {
    name: "AgriCorp Industries",
    logoUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&h=200&fit=crop",
    industry: "Agriculture",
    location: "Lucknow, India",
    partnership: "Key Account",
    description: "Agricultural equipment and packaging solutions for the farming industry.",
    status: "active"
  },
  {
    name: "BuildMax Construction",
    logoUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=200&h=200&fit=crop",
    industry: "Construction",
    location: "Kolkata, India",
    partnership: "Regular Client",
    description: "Construction materials and specialized packaging for building industry applications.",
    status: "active"
  },
  {
    name: "ChemPure Limited",
    logoUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=200&h=200&fit=crop",
    industry: "Chemical",
    location: "Ahmedabad, India",
    partnership: "Premium Partner",
    description: "Chemical processing and safe packaging solutions for industrial chemical applications.",
    status: "active"
  }
];

export async function initializeCustomersData(): Promise<{ success: boolean; message: string; count?: number }> {
  try {
    console.log('🏢 Initializing customers data...');
    
    // Check if customers already exist
    const existingCustomers = await customersService.getAll();
    if (existingCustomers.length > 0) {
      console.log(`ℹ️ Found ${existingCustomers.length} existing customers, skipping initialization`);
      return { 
        success: true, 
        message: `Found ${existingCustomers.length} existing customers, no initialization needed`,
        count: existingCustomers.length
      };
    }

    // Add sample customers
    let addedCount = 0;
    for (const customerData of sampleCustomers) {
      try {
        await customersService.create(customerData);
        addedCount++;
        console.log(`✅ Added customer: ${customerData.name}`);
      } catch (error) {
        console.warn(`⚠️ Failed to add customer ${customerData.name}:`, error);
      }
    }

    console.log(`🚀 Successfully initialized ${addedCount} customers!`);
    return { 
      success: true, 
      message: `Successfully added ${addedCount} sample customers to your database`,
      count: addedCount
    };

  } catch (error: any) {
    console.error('❌ Error initializing customers:', error);
    
    let errorMessage = 'Failed to initialize customers data';
    if (error.code === 'permission-denied') {
      errorMessage = 'Permission denied: Please configure your Firestore security rules to allow customer creation';
    } else if (error.message) {
      errorMessage = `Error: ${error.message}`;
    }
    
    return { 
      success: false, 
      message: errorMessage 
    };
  }
}
