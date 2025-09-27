import { ProductsAPI, MachineryAPI, CareersAPI } from './api';

const sampleProducts = [
  {
    name: "HDPE Carry Bags",
    description: "High-density polyethylene carry bags perfect for retail and grocery stores. Available in various sizes with excellent strength and durability.",
    category: "Retail Bags",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop",
    features: ["Eco-friendly", "Tear resistant", "Multiple sizes", "Custom printing available"],
    status: "active"
  },
  {
    name: "LDPE Food Storage Bags",
    description: "Low-density polyethylene bags designed specifically for food storage with FDA approved materials.",
    category: "Food Packaging",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop",
    features: ["Food grade", "Moisture resistant", "Freezer safe", "Clear visibility"],
    status: "active"
  },
  {
    name: "Bio-degradable Shopping Bags",
    description: "Environmentally friendly shopping bags made from biodegradable materials that decompose naturally.",
    category: "Eco-Friendly",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&h=200&fit=crop",
    features: ["100% biodegradable", "Compostable", "Strong handles", "Available in multiple colors"],
    status: "active"
  },
  {
    name: "Industrial Garbage Bags",
    description: "Heavy-duty garbage bags designed for industrial and commercial use with superior puncture resistance.",
    category: "Industrial",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
    features: ["Extra thick", "Puncture resistant", "Large capacity", "Tie handles"],
    status: "active"
  },
  {
    name: "Vacuum Packaging Bags",
    description: "Specialized bags for vacuum packaging applications, extending product shelf life significantly.",
    category: "Specialized",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop",
    features: ["Vacuum compatible", "Extended shelf life", "Barrier protection", "Various sizes"],
    status: "active"
  },
  {
    name: "Agricultural Produce Bags",
    description: "Ventilated bags designed for fresh produce storage and transportation with optimal airflow.",
    category: "Agricultural",
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop",
    features: ["Ventilation holes", "Moisture control", "Durable material", "Easy handling"],
    status: "active"
  }
];

const sampleMachinery = [
  {
    name: "Blown Film Extrusion Line",
    description: "High-performance blown film extrusion line for producing various plastic films",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800",
    category: "Extrusion Equipment",
    specifications: ["Width: 1500mm", "Output: 200 kg/h", "Layer: 3-layer capability"],
    manufacturer: "Reifenhäuser",
    yearInstalled: "2023",
    capacity: "200 kg/hour"
  },
  {
    name: "Flexographic Printing Press",
    description: "6-color flexographic printing press for high-quality bag printing",
    imageUrl: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800",
    category: "Printing Equipment",
    specifications: ["Colors: 6", "Web width: 1200mm", "Speed: 300 m/min"],
    manufacturer: "Windmöller & Hölscher",
    yearInstalled: "2022", 
    capacity: "1500 m²/hour"
  },
  {
    name: "Plastic Film Extruder",
    description: "Advanced extrusion line for producing high-quality plastic films",
    imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800",
    category: "Extrusion Equipment",
    specifications: ["Width: 2000mm", "Thickness: 10-200 microns", "Output: 500 kg/h"],
    manufacturer: "Davis-Standard",
    yearInstalled: "2020",
    capacity: "500 kg/hour"
  }
];

const sampleJobs = [
  {
    title: "Production Manager",
    department: "Manufacturing",
    location: "Mumbai, Maharashtra",
    type: "Full-time",
    description: "We are seeking an experienced Production Manager to oversee our manufacturing operations and ensure optimal productivity.",
    requirements: ["Bachelor's degree in Engineering", "5+ years in manufacturing", "Leadership experience", "Knowledge of plastic manufacturing processes"],
    status: "active"
  },
  {
    title: "Quality Control Specialist", 
    department: "Quality Assurance",
    location: "Chennai, Tamil Nadu",
    type: "Full-time",
    description: "Join our quality team to ensure our products meet the highest standards of excellence.",
    requirements: ["Bachelor's in Chemistry or related field", "3+ years QC experience", "Knowledge of ISO standards", "Attention to detail"],
    status: "active"
  }
];

export async function initializeSystemData() {
  try {
    console.log('Initializing system data...');
    
    // Check if data already exists
    const productsResponse = await ProductsAPI.getAllAdmin();
    const machineryResponse = await MachineryAPI.getAllAdmin();
    const jobsResponse = await CareersAPI.getAllJobs();
    
    // Initialize products if none exist
    if (!productsResponse.error && (!productsResponse.data || productsResponse.data.length === 0)) {
      console.log('Initializing products...');
      for (const product of sampleProducts) {
        await ProductsAPI.create(product);
      }
      console.log('Products initialized successfully');
    }
    
    // Initialize machinery if none exist
    if (!machineryResponse.error && (!machineryResponse.data || machineryResponse.data.length === 0)) {
      console.log('Initializing machinery...');
      for (const machine of sampleMachinery) {
        await MachineryAPI.create(machine);
      }
      console.log('Machinery initialized successfully');
    }
    
    // Initialize jobs if none exist
    if (!jobsResponse.error && (!jobsResponse.data || jobsResponse.data.length === 0)) {
      console.log('Initializing jobs...');
      for (const job of sampleJobs) {
        await CareersAPI.createJob(job);
      }
      console.log('Jobs initialized successfully');
    }
    
    return { success: true, message: 'System data initialized successfully' };
  } catch (error) {
    console.error('Failed to initialize system data:', error);
    return { success: false, error: 'Failed to initialize system data' };
  }
}
