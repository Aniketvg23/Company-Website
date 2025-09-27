import { projectId, publicAnonKey } from './supabase/info';

export interface Machinery {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  specifications: string[];
  status: string;
  manufacturer: string;
  yearInstalled: string;
  capacity: string;
  createdAt: string;
}

const comprehensiveMachinery = [
  {
    name: "Multi-Layer Blown Film Extrusion Line",
    description: "State-of-the-art blown film extrusion line capable of producing multi-layer plastic films with superior barrier properties. This advanced system ensures consistent quality and high production efficiency.",
    imageUrl: "https://images.unsplash.com/photo-1701448149957-b96dbd1926ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFzdGljJTIwZXh0cnVzaW9uJTIwbWFjaGluZSUyMGluZHVzdHJpYWx8ZW58MXx8fHwxNzU3NDA3NzczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Extrusion",
    manufacturer: "Windmöller & Hölscher",
    yearInstalled: "2023",
    capacity: "500 kg/hour",
    specifications: [
      "7-layer co-extrusion capability",
      "Film width up to 2500mm",
      "Thickness range: 15-200 microns",
      "Automatic thickness control system",
      "Energy-efficient heating system",
      "Real-time quality monitoring"
    ]
  },
  {
    name: "High-Speed Flexographic Printing Press",
    description: "Advanced 8-color flexographic printing press designed for high-quality printing on plastic films and bags. Delivers exceptional print registration and color consistency.",
    imageUrl: "https://images.unsplash.com/photo-1729944950511-e9c71556cfd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwcHJpbnRpbmclMjBtYWNoaW5lfGVufDF8fHx8MTc1NzQwNzc3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Printing",
    manufacturer: "Bobst Group",
    yearInstalled: "2022",
    capacity: "400 m/min",
    specifications: [
      "8-color printing stations",
      "Central impression design",
      "Automatic register control",
      "Web width up to 1600mm",
      "Solvent and water-based ink compatibility",
      "Quick job changeover system"
    ]
  },
  {
    name: "Automated Bag Making Machine",
    description: "High-efficiency bag making machine capable of producing various types of plastic bags including flat bags, gusseted bags, and custom designs with precision sealing.",
    imageUrl: "https://images.unsplash.com/photo-1637251393438-30eca8828253?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFzdGljJTIwYmFnJTIwbWFudWZhY3R1cmluZyUyMG1hY2hpbmV8ZW58MXx8fHwxNzU3NDA3NzgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Bag Making",
    manufacturer: "Karlville Development",
    yearInstalled: "2023",
    capacity: "150 bags/min",
    specifications: [
      "Servo motor driven system",
      "Programmable bag lengths",
      "Hot knife sealing technology",
      "Automatic perforation system",
      "Quality inspection sensors",
      "Multiple bag format capability"
    ]
  },
  {
    name: "Advanced Quality Control Testing Lab",
    description: "Comprehensive testing laboratory equipped with latest instruments for quality analysis including tensile strength, barrier properties, and chemical resistance testing.",
    imageUrl: "https://images.unsplash.com/photo-1627704671340-0969d7dbac25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxxdWFsaXR5JTIwY29udHJvbCUyMHRlc3RpbmclMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzU3NDA3Nzg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Quality Control",
    manufacturer: "Instron & Labthink",
    yearInstalled: "2021",
    capacity: "200 tests/day",
    specifications: [
      "Universal testing machine (50kN)",
      "Oxygen transmission rate tester",
      "Water vapor permeability tester",
      "Heat seal strength tester",
      "Dart impact tester",
      "Color matching system"
    ]
  },
  {
    name: "Industrial Heat Sealing Station",
    description: "Precision heat sealing equipment for creating strong, consistent seals on various plastic materials. Features programmable temperature and pressure controls.",
    imageUrl: "https://images.unsplash.com/photo-1701448149957-b96dbd1926ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWF0JTIwc2VhbGluZyUyMG1hY2hpbmUlMjBpbmR1c3RyaWFsfGVufDF8fHx8MTc1NzQwNzc5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Sealing",
    manufacturer: "PAC Machinery",
    yearInstalled: "2022",
    capacity: "300 seals/hour",
    specifications: [
      "Digital temperature control (±1°C)",
      "Pneumatic pressure system",
      "Multiple sealing jaw options",
      "Timer-controlled sealing cycles",
      "Safety interlock system",
      "Adjustable sealing width"
    ]
  },
  {
    name: "Precision Cutting & Slitting Machine",
    description: "High-precision cutting and slitting equipment for accurate material processing. Ensures clean cuts and precise dimensions for all plastic film applications.",
    imageUrl: "https://images.unsplash.com/photo-1738162837335-3745e5d16c09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwY3V0dGluZyUyMG1hY2hpbmV8ZW58MXx8fHwxNzU3NDA3Nzk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Cutting",
    manufacturer: "Atlas Converting",
    yearInstalled: "2023",
    capacity: "800 m/min",
    specifications: [
      "Servo-driven unwind/rewind",
      "Pneumatic knife holders",
      "Web guide system",
      "Automatic tension control",
      "Multiple slitting methods",
      "Waste matrix removal"
    ]
  },
  {
    name: "Injection Molding System",
    description: "Advanced injection molding machine for producing plastic components and specialized packaging elements. Features precise temperature and pressure control.",
    imageUrl: "https://images.unsplash.com/photo-1657186593846-8d3e67155468?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFzdGljJTIwaW5qZWN0aW9uJTIwbW9sZGluZyUyMG1hY2hpbmV8ZW58MXx8fHwxNzU3NDA3Nzk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Molding",
    manufacturer: "Arburg",
    yearInstalled: "2021",
    capacity: "180 tons clamping force",
    specifications: [
      "Servo-electric drive system",
      "Multi-component injection capability",
      "Precise shot weight control",
      "Energy-efficient operation",
      "Advanced process monitoring",
      "Quick mold change system"
    ]
  },
  {
    name: "Automated Packaging Line",
    description: "Fully automated packaging and sorting system that handles finished products with minimal human intervention. Increases efficiency and maintains product quality.",
    imageUrl: "https://images.unsplash.com/photo-1651525670033-279c26cc2347?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWNrYWdpbmclMjBhdXRvbWF0aW9uJTIwbWFjaGluZXJ5fGVufDF8fHx8MTc1NzQwNzgwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Automation",
    manufacturer: "Krones AG",
    yearInstalled: "2023",
    capacity: "1000 packages/hour",
    specifications: [
      "Vision inspection system",
      "Robotic pick and place",
      "Conveyor belt system",
      "Automatic labeling",
      "Reject handling system",
      "Real-time production tracking"
    ]
  },
  {
    name: "Material Handling & Storage System",
    description: "Comprehensive material handling system including silos, conveying equipment, and automated storage for raw materials and finished products.",
    imageUrl: "https://images.unsplash.com/photo-1701448149957-b96dbd1926ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFzdGljJTIwZXh0cnVzaW9uJTIwbWFjaGluZSUyMGluZHVzdHJpYWx8ZW58MXx8fHwxNzU3NDA3NzczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Material Handling",
    manufacturer: "Motan-Colortronic",
    yearInstalled: "2022",
    capacity: "50 tons storage",
    specifications: [
      "Pneumatic conveying system",
      "Material drying capability",
      "Automatic dosing units",
      "Central material distribution",
      "Dust collection system",
      "Inventory monitoring sensors"
    ]
  },
  {
    name: "Waste Recycling & Reprocessing Unit",
    description: "Environmental-friendly recycling system that processes production waste into reusable materials, supporting our sustainability initiatives.",
    imageUrl: "https://images.unsplash.com/photo-1738162837335-3745e5d16c09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwY3V0dGluZyUyMG1hY2hpbmV8ZW58MXx8fHwxNzU3NDA3Nzk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Recycling",
    manufacturer: "Erema Group",
    yearInstalled: "2023",
    capacity: "200 kg/hour",
    specifications: [
      "Shredding and washing system",
      "Melt filtration technology",
      "Pelletizing capability",
      "Contamination removal",
      "Energy recovery system",
      "Quality monitoring"
    ]
  }
];

export async function initializeMachineryInDatabase() {
  console.log('Starting database machinery initialization...');
  
  try {
    // Test server connection first with timeout
    const healthResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-aa812cee/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(3000) // 3 second timeout
    });
    
    if (!healthResponse.ok) {
      console.log('Server unavailable, using local storage instead...');
      return initializeMachineryInLocalStorage();
    }

    console.log('✅ Server available, checking for existing machinery...');
    
    // Check if machinery already exists
    const existingMachineryResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-aa812cee/machinery`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      signal: AbortSignal.timeout(5000)
    });
    
    if (existingMachineryResponse.ok) {
      const existingMachinery = await existingMachineryResponse.json();
      if (existingMachinery.length > 0) {
        console.log(`Machinery already exists in database (${existingMachinery.length} machines)`);
        return { success: true, message: `Found ${existingMachinery.length} existing machines in database`, count: existingMachinery.length };
      }
    }

    console.log('No machinery found, initializing in local storage for immediate availability...');
    return initializeMachineryInLocalStorage();

  } catch (error) {
    console.log('Database connection failed, using local storage for immediate availability...');
    return initializeMachineryInLocalStorage();
  }
}

export async function initializeMachineryInLocalStorage() {
  console.log('Initializing machinery in local storage...');
  
  try {
    // Check if machinery already exists in local storage
    const existingMachinery = localStorage.getItem('cartify_machinery');
    if (existingMachinery) {
      const machinery = JSON.parse(existingMachinery);
      if (machinery.length >= comprehensiveMachinery.length) {
        console.log('Full machinery catalog already exists in local storage, skipping initialization');
        return { success: true, message: 'Machinery already exists in local storage', count: machinery.length };
      } else {
        console.log(`Found ${machinery.length} machines, but expanding to ${comprehensiveMachinery.length} machines...`);
      }
    }

    // Add machinery to local storage
    const machinery: Machinery[] = [];
    
    for (const machineryData of comprehensiveMachinery) {
      const machineryId = `machinery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const machine: Machinery = {
        id: machineryId,
        name: machineryData.name,
        description: machineryData.description,
        imageUrl: machineryData.imageUrl,
        category: machineryData.category,
        specifications: machineryData.specifications,
        manufacturer: machineryData.manufacturer,
        yearInstalled: machineryData.yearInstalled,
        capacity: machineryData.capacity,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      
      machinery.push(machine);
      console.log(`✓ Prepared machine: ${machineryData.name}`);
      
      // Small delay to ensure unique timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    // Save all machinery to local storage
    localStorage.setItem('cartify_machinery', JSON.stringify(machinery));
    
    return { 
      success: true, 
      message: `Successfully initialized ${machinery.length} machines in local storage`,
      count: machinery.length 
    };

  } catch (error) {
    console.error('Error during local storage initialization:', error);
    return { 
      success: false, 
      message: 'Failed to initialize machinery',
      error: error.message 
    };
  }
}

// Helper function to clear all machinery (for testing)
export async function clearAllMachinery() {
  try {
    // Clear from local storage
    localStorage.removeItem('cartify_machinery');
    localStorage.removeItem('cartify_machinery_initialized');
    sessionStorage.removeItem('machinery_init_attempted');
    console.log('Cleared machinery from local storage');
    
    return { success: true, message: 'Machinery cleared from local storage' };
  } catch (error) {
    console.error('Error clearing machinery:', error);
    return { success: false, message: 'Failed to clear machinery', error: error.message };
  }
}

// Quick initialization function for immediate use
export async function quickInitMachinery() {
  console.log('🚀 Quick machinery initialization started...');
  
  try {
    // First try local storage (faster for immediate results)
    const localResult = await initializeMachineryInLocalStorage();
    
    if (localResult.success) {
      console.log('✅ Local storage initialization successful:', localResult.message);
      
      // Also try database initialization in the background
      try {
        const dbResult = await initializeMachineryInDatabase();
        if (dbResult.success) {
          console.log('✅ Database initialization also successful:', dbResult.message);
        }
      } catch (dbError) {
        console.log('⚠️ Database initialization failed, but local storage is working:', dbError);
      }
      
      return localResult;
    } else {
      return localResult;
    }
  } catch (error) {
    console.error('❌ Quick initialization failed:', error);
    return { success: false, message: 'Failed to initialize machinery', error: error.message };
  }
}

// Function to check if machinery exists
export async function checkMachineryExists() {
  try {
    // Check local storage first
    const localMachinery = localStorage.getItem('cartify_machinery');
    if (localMachinery) {
      const machinery = JSON.parse(localMachinery);
      if (machinery.length > 0) {
        return { exists: true, source: 'localStorage', count: machinery.length };
      }
    }
    
    // Check server
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-aa812cee/machinery`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (response.ok) {
        const serverMachinery = await response.json();
        if (serverMachinery.length > 0) {
          return { exists: true, source: 'server', count: serverMachinery.length };
        }
      }
    } catch (serverError) {
      console.log('Server check failed:', serverError);
    }
    
    return { exists: false, source: 'none', count: 0 };
  } catch (error) {
    console.error('Error checking machinery:', error);
    return { exists: false, source: 'error', count: 0 };
  }
}
