// Customer Initialization Script
// Run this script to populate your Firebase database with sample customer data

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  // Add your Firebase configuration here
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const customers = [
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

async function initializeCustomers() {
  console.log('🏢 Initializing customers data...');
  
  try {
    const customersCollection = collection(db, 'customers');
    
    for (const customer of customers) {
      const customerData = {
        ...customer,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await addDoc(customersCollection, customerData);
      console.log(`✅ Customer "${customer.name}" added with ID: ${docRef.id}`);
    }
    
    console.log(`🚀 Successfully initialized ${customers.length} customers!`);
    console.log('📊 Customers data is now available in your Firebase database.');
    
  } catch (error) {
    console.error('❌ Error initializing customers:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure your Firebase configuration is correct');
    console.log('2. Ensure your Firestore security rules allow writes');
    console.log('3. Check that your Firebase project has Firestore enabled');
  }
}

// Run the initialization
initializeCustomers();
