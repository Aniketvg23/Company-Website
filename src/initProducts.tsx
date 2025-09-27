// Quick initialization script to add products immediately
import { quickInitProducts } from './utils/initializeProducts';

async function runInitialization() {
  console.log('🚀 Running product initialization...');
  
  try {
    const result = await quickInitProducts();
    
    if (result.success) {
      console.log('✅ Initialization successful:', result.message);
      console.log(`📦 Total products: ${result.count}`);
    } else {
      console.log('❌ Initialization failed:', result.message);
      if (result.error) {
        console.log('Error details:', result.error);
      }
    }
  } catch (error) {
    console.error('❌ Initialization error:', error);
  }
}

// Auto-run when this file is imported
runInitialization();
