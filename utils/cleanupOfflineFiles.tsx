// Firebase-only cleanup utility
// This removes offline storage files and configurations

export function cleanupOfflineFiles(): void {
  console.log('🧹 Cleaning up offline files for Firebase-only mode...');
  
  // Clear localStorage keys
  const offlineKeys = [
    'cartify_offline_data',
    'cartify_offline_data_backup',
    'cartify_fallback_data',
    'cartify_products',
    'cartify_machinery',
    'cartify_jobs',
    'cartify_contacts',
    'cartify_applications',
    'cartify_customers',
    'cartify_company'
  ];

  offlineKeys.forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  });

  console.log('✅ Offline storage cleaned up');
}

// Auto-cleanup on import (run once)
cleanupOfflineFiles();
