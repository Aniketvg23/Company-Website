// Simple script to clear and reinitialize products with expanded catalog
(function() {
  console.log('🚀 Expanding product catalog to 26 products...');
  
  try {
    // Clear existing products
    localStorage.removeItem('cartify_products');
    localStorage.removeItem('cartify_products_initialized');
    sessionStorage.removeItem('products_init_attempted');
    
    console.log('✅ Cleared existing products');
    console.log('🔄 Page will reload to initialize new product catalog...');
    
    // Reload page to trigger product initialization
    window.location.reload();
  } catch (error) {
    console.error('❌ Error expanding products:', error);
  }
})();
