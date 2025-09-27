import { useEffect, useState } from 'react';
import { quickInitProducts, checkProductsExist } from '../utils/initializeProducts';

export function ProductInitializer() {
  const [initialized, setInitialized] = useState(false);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const initializeProducts = async () => {
      // Check if we've already tried to initialize products in this session
      if (sessionStorage.getItem('products_init_attempted')) {
        return;
      }

      try {
        // First check if products already exist
        const existsCheck = await checkProductsExist();
        
        if (existsCheck.exists && existsCheck.count >= 20) {
          console.log(`✅ Products already exist in ${existsCheck.source} (${existsCheck.count} products)`);
          setInitialized(true);
          sessionStorage.setItem('products_init_attempted', 'true');
          localStorage.setItem('cartify_products_initialized', 'true');
          return;
        } else if (existsCheck.exists && existsCheck.count < 20) {
          console.log(`🔄 Found ${existsCheck.count} products, expanding catalog to 26 products...`);
          localStorage.removeItem('cartify_products');
          localStorage.removeItem('cartify_products_initialized');
        }

        console.log('🚀 Auto-initializing products...');
        setStatus('Setting up product catalog...');
        
        // Use the quick initialization which tries local storage first
        const result = await quickInitProducts();
        
        if (result.success) {
          console.log('✅ Products initialized:', result.message);
          setStatus('✅ Product catalog ready');
          
          // Store success in localStorage for other components to check
          localStorage.setItem('cartify_products_initialized', 'true');
        } else {
          console.log('⚠️ Products initialization result:', result.message);
          setStatus('⚠️ Using demo mode');
        }
        
        setInitialized(true);
        sessionStorage.setItem('products_init_attempted', 'true');
        
        // Clear status after a few seconds
        setTimeout(() => setStatus(''), 3000);
      } catch (error) {
        console.error('❌ Error during auto-initialization:', error);
        setStatus('⚠️ Running in demo mode');
        sessionStorage.setItem('products_init_attempted', 'true');
        
        // Clear status after a few seconds
        setTimeout(() => setStatus(''), 3000);
      }
    };

    // Run initialization with a small delay to ensure other components load first
    const timer = setTimeout(initializeProducts, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Show a small status indicator if needed (only during initialization)
  if (status && status.includes('Setting up')) {
    return (
      <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
        <div className="flex items-center space-x-2 text-sm">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
          <span>{status}</span>
        </div>
      </div>
    );
  }

  // This component doesn't render anything visible once done
  return null;
}
