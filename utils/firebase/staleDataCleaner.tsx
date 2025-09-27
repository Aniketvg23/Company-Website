// Stale Data Cleanup Utilities
import { productsService, machineryService, jobsService } from './firestore';

export class StaleDataCleaner {
  // Clean up any stale localStorage entries that might have old IDs
  static cleanupLocalStorage(): void {
    try {
      const keysToCheck = [
        'cartify_products',
        'cartify_machinery', 
        'cartify_jobs',
        'cartify_applications',
        'cartify_contacts',
        'cartify_customers',
        'cartify_offline_data',
        'cartify_admin_data'
      ];

      let cleanedCount = 0;
      keysToCheck.forEach(key => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          cleanedCount++;
        }
      });

      if (cleanedCount > 0) {
        console.log(`🧹 Cleaned ${cleanedCount} stale localStorage entries`);
      }
    } catch (error) {
      console.warn('Could not clean localStorage:', error);
    }
  }

  // Validate that all products in an array actually exist in Firestore
  static async validateProductIds(productIds: string[]): Promise<string[]> {
    const validIds: string[] = [];
    
    try {
      const allProducts = await productsService.getAll();
      const existingIds = new Set(allProducts.map(p => p.id));

      productIds.forEach(id => {
        if (existingIds.has(id)) {
          validIds.push(id);
        } else {
          console.log(`ℹ️ Removing stale product ID: ${id}`);
        }
      });
    } catch (error) {
      console.warn('Could not validate product IDs:', error);
      return productIds; // Return original list if validation fails
    }

    return validIds;
  }

  // Validate that all machinery in an array actually exist in Firestore
  static async validateMachineryIds(machineryIds: string[]): Promise<string[]> {
    const validIds: string[] = [];
    
    try {
      const allMachinery = await machineryService.getAll();
      const existingIds = new Set(allMachinery.map(m => m.id));

      machineryIds.forEach(id => {
        if (existingIds.has(id)) {
          validIds.push(id);
        } else {
          console.log(`ℹ️ Removing stale machinery ID: ${id}`);
        }
      });
    } catch (error) {
      console.warn('Could not validate machinery IDs:', error);
      return machineryIds; // Return original list if validation fails
    }

    return validIds;
  }

  // Get a summary of data consistency
  static async getConsistencyReport(): Promise<{
    products: { total: number, accessible: boolean };
    machinery: { total: number, accessible: boolean };
    jobs: { total: number, accessible: boolean };
    issues: string[];
  }> {
    const issues: string[] = [];
    const report = {
      products: { total: 0, accessible: false },
      machinery: { total: 0, accessible: false },
      jobs: { total: 0, accessible: false },
      issues
    };

    try {
      // Check products
      try {
        const products = await productsService.getAll();
        report.products = { total: products.length, accessible: true };
      } catch (error: any) {
        if (error.code === 'permission-denied') {
          issues.push('Products collection requires Firestore security rules');
        } else {
          issues.push(`Products error: ${error.message}`);
        }
      }

      // Check machinery
      try {
        const machinery = await machineryService.getAll();
        report.machinery = { total: machinery.length, accessible: true };
      } catch (error: any) {
        if (error.code === 'permission-denied') {
          issues.push('Machinery collection requires Firestore security rules');
        } else {
          issues.push(`Machinery error: ${error.message}`);
        }
      }

      // Check jobs
      try {
        const jobs = await jobsService.getAll();
        report.jobs = { total: jobs.length, accessible: true };
      } catch (error: any) {
        if (error.code === 'permission-denied') {
          issues.push('Jobs collection requires Firestore security rules');
        } else {
          issues.push(`Jobs error: ${error.message}`);
        }
      }

    } catch (error) {
      issues.push(`General connectivity error: ${error}`);
    }

    return report;
  }

  // Auto-cleanup routine
  static async performAutoCleanup(): Promise<void> {
    console.log('🔄 Starting auto-cleanup routine...');
    
    // Clean localStorage
    this.cleanupLocalStorage();
    
    // Get consistency report
    const report = await this.getConsistencyReport();
    
    if (report.issues.length === 0) {
      console.log('✅ Auto-cleanup completed - no issues found');
      console.log(`📊 Data summary: ${report.products.total} products, ${report.machinery.total} machinery, ${report.jobs.total} jobs`);
    } else {
      console.log('ℹ️ Auto-cleanup completed with notes:');
      report.issues.forEach(issue => console.log(`  - ${issue}`));
    }
  }
}
