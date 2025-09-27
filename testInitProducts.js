// Simple test script to verify product initialization
// This can be run in the browser console to test the initialization

async function testProductInitialization() {
  console.log('Testing product initialization...');
  
  try {
    // Import the initialization function (this would need to be adapted for actual use)
    const { initializeProductsInLocalStorage } = await import('./utils/initializeProducts.tsx');
    
    const result = await initializeProductsInLocalStorage();
    
    if (result.success) {
      console.log('✅ Success:', result.message);
      console.log(`📦 Products added: ${result.count}`);
      
      // Verify products were added
      const storedProducts = localStorage.getItem('cartify_products');
      if (storedProducts) {
        const products = JSON.parse(storedProducts);
        console.log('📋 Products in storage:', products.length);
        console.log('🔍 Sample product:', products[0]);
      }
    } else {
      console.log('❌ Failed:', result.message);
      if (result.error) {
        console.log('🔍 Error details:', result.error);
      }
    }
  } catch (error) {
    console.log('❌ Test failed with error:', error);
  }
}

// Auto-run the test
testProductInitialization();
