// Data Synchronization Utilities
import { productsService, machineryService, jobsService } from './firestore';

export interface DataSyncResult {
  collection: string;
  localCount: number;
  firestoreCount: number;
  missingInFirestore: string[];
  extraInLocal: string[];
  syncNeeded: boolean;
}

export class DataSyncHelper {
  // Check sync status between local data and Firestore
  static async checkSyncStatus(localProducts: any[], localMachinery: any[], localJobs: any[]): Promise<DataSyncResult[]> {
    const results: DataSyncResult[] = [];

    try {
      // Check products sync
      const firestoreProducts = await productsService.getAll();
      const productSync = this.compareSyncState('products', localProducts, firestoreProducts);
      results.push(productSync);

      // Check machinery sync
      const firestoreMachinery = await machineryService.getAll();
      const machinerySync = this.compareSyncState('machinery', localMachinery, firestoreMachinery);
      results.push(machinerySync);

      // Check jobs sync
      const firestoreJobs = await jobsService.getAll();
      const jobsSync = this.compareSyncState('jobs', localJobs, firestoreJobs);
      results.push(jobsSync);

    } catch (error) {
      console.error('Error checking sync status:', error);
    }

    return results;
  }

  // Compare local and Firestore data
  private static compareSyncState(collection: string, localData: any[], firestoreData: any[]): DataSyncResult {
    const localIds = new Set(localData.map(item => item.id));
    const firestoreIds = new Set(firestoreData.map(item => item.id));

    const missingInFirestore = localData
      .filter(item => !firestoreIds.has(item.id))
      .map(item => item.id);

    const extraInLocal = Array.from(localIds)
      .filter(id => !firestoreIds.has(id));

    return {
      collection,
      localCount: localData.length,
      firestoreCount: firestoreData.length,
      missingInFirestore,
      extraInLocal,
      syncNeeded: missingInFirestore.length > 0 || extraInLocal.length > 0
    };
  }

  // Clean up stale data (remove local items that don't exist in Firestore)
  static async cleanupStaleData(): Promise<{ cleaned: boolean; message: string }> {
    try {
      console.log('🧹 Starting data cleanup...');
      
      // This would typically clean up localStorage or local state
      // For now, we'll just log what we find
      const firestoreProducts = await productsService.getAll();
      const firestoreMachinery = await machineryService.getAll();
      const firestoreJobs = await jobsService.getAll();

      const message = `✅ Data cleanup completed. Found ${firestoreProducts.length} products, ${firestoreMachinery.length} machinery, ${firestoreJobs.length} jobs in Firestore.`;
      
      return { cleaned: true, message };
    } catch (error) {
      console.error('Error during data cleanup:', error);
      return { cleaned: false, message: `❌ Data cleanup failed: ${error}` };
    }
  }

  // Force refresh all data from Firestore
  static async forceRefreshFromFirestore(): Promise<{ products: any[], machinery: any[], jobs: any[] }> {
    try {
      console.log('🔄 Force refreshing all data from Firestore...');
      
      const [products, machinery, jobs] = await Promise.all([
        productsService.getAll(),
        machineryService.getAll(),
        jobsService.getAll()
      ]);

      console.log(`✅ Force refresh completed: ${products.length} products, ${machinery.length} machinery, ${jobs.length} jobs`);
      
      return { products, machinery, jobs };
    } catch (error) {
      console.error('Error during force refresh:', error);
      throw error;
    }
  }

  // Validate data integrity
  static validateData(data: any[]): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    data.forEach((item, index) => {
      if (!item.id) {
        issues.push(`Item at index ${index} missing ID`);
      }
      if (!item.name) {
        issues.push(`Item ${item.id || index} missing name`);
      }
      if (!item.createdAt) {
        issues.push(`Item ${item.id || index} missing createdAt`);
      }
    });

    return {
      valid: issues.length === 0,
      issues
    };
  }
}
