import { useEffect, useState } from 'react';
import { quickInitMachinery, checkMachineryExists } from '../utils/initializeMachinery';

export function MachineryInitializer() {
  const [initialized, setInitialized] = useState(false);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const initializeMachinery = async () => {
      // Check if we've already tried to initialize machinery in this session
      if (sessionStorage.getItem('machinery_init_attempted')) {
        return;
      }

      try {
        // First check if machinery already exists
        const existsCheck = await checkMachineryExists();
        
        if (existsCheck.exists && existsCheck.count >= 8) {
          console.log(`✅ Machinery already exists in ${existsCheck.source} (${existsCheck.count} machines)`);
          setInitialized(true);
          sessionStorage.setItem('machinery_init_attempted', 'true');
          localStorage.setItem('cartify_machinery_initialized', 'true');
          return;
        } else if (existsCheck.exists && existsCheck.count < 8) {
          console.log(`🔄 Found ${existsCheck.count} machines, expanding catalog to 10 machines...`);
          localStorage.removeItem('cartify_machinery');
          localStorage.removeItem('cartify_machinery_initialized');
        }

        console.log('🚀 Auto-initializing machinery...');
        setStatus('Setting up machinery catalog...');
        
        // Use the quick initialization which tries local storage first
        const result = await quickInitMachinery();
        
        if (result.success) {
          console.log('✅ Machinery initialized:', result.message);
          setStatus('✅ Machinery catalog ready');
          
          // Store success in localStorage for other components to check
          localStorage.setItem('cartify_machinery_initialized', 'true');
        } else {
          console.log('⚠️ Machinery initialization result:', result.message);
          setStatus('⚠️ Using demo mode');
        }
        
        setInitialized(true);
        sessionStorage.setItem('machinery_init_attempted', 'true');
        
        // Clear status after a few seconds
        setTimeout(() => setStatus(''), 3000);
      } catch (error) {
        console.error('❌ Error during auto-initialization:', error);
        setStatus('⚠️ Running in demo mode');
        sessionStorage.setItem('machinery_init_attempted', 'true');
        
        // Clear status after a few seconds
        setTimeout(() => setStatus(''), 3000);
      }
    };

    // Run initialization with a small delay to ensure other components load first
    const timer = setTimeout(initializeMachinery, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Show a small status indicator if needed (only during initialization)
  if (status && status.includes('Setting up')) {
    return (
      <div className="fixed bottom-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
        <div className="flex items-center space-x-2 text-sm">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-secondary border-t-transparent"></div>
          <span>{status}</span>
        </div>
      </div>
    );
  }

  // This component doesn't render anything visible once done
  return null;
}
