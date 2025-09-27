// Auto-run machinery initialization
(function() {
  if (typeof window !== 'undefined' && window.localStorage) {
    // Import and run initialization
    import('./utils/initializeMachinery.tsx').then(module => {
      module.quickInitMachinery().then(result => {
        console.log('🏭 Machinery auto-initialization:', result.message);
      }).catch(error => {
        console.log('⚠️ Machinery auto-init failed:', error.message);
      });
    }).catch(error => {
      console.log('⚠️ Could not load machinery module');
    });
  }
})();
