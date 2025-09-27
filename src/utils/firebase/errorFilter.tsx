// Error filtering and classification utilities
export class ErrorFilter {
  // Classify error types
  static classifyError(error: any): 'critical' | 'warning' | 'info' | 'expected' {
    const message = error.message || error.toString();
    const code = error.code;

    // Permission denied is expected during setup
    if (code === 'permission-denied') {
      return 'expected';
    }

    // Document not found is usually a sync issue, not critical
    if (message.includes('not found') || message.includes('No document to update')) {
      return 'info';
    }

    // API key issues are setup problems
    if (message.includes('api-key-not-valid') || message.includes('API key not valid')) {
      return 'warning';
    }

    // Network issues are temporary
    if (message.includes('network') || message.includes('timeout')) {
      return 'warning';
    }

    // Project not found is a config issue
    if (message.includes('project-not-found') || message.includes('Project not found')) {
      return 'warning';
    }

    // Everything else is potentially critical
    return 'critical';
  }

  // Check if error should be shown to user
  static shouldShowToUser(error: any): boolean {
    const classification = this.classifyError(error);
    return classification === 'critical' || classification === 'warning';
  }

  // Get user-friendly error message
  static getUserMessage(error: any): string {
    const message = error.message || error.toString();
    const classification = this.classifyError(error);

    if (classification === 'expected' || classification === 'info') {
      return ''; // No message for expected/info errors
    }

    if (message.includes('permission-denied')) {
      return 'Database access requires setup. Please configure Firestore security rules.';
    }

    if (message.includes('api-key-not-valid')) {
      return 'Invalid Firebase configuration. Please check your API key.';
    }

    if (message.includes('project-not-found')) {
      return 'Firebase project not found. Please verify your project ID.';
    }

    if (message.includes('network')) {
      return 'Connection issue. Please check your internet connection.';
    }

    if (message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }

    // For other errors, return a generic message
    return 'An unexpected error occurred. Please try refreshing the page.';
  }

  // Log error appropriately based on classification
  static logError(error: any, context: string = 'Unknown'): void {
    const classification = this.classifyError(error);
    const message = error.message || error.toString();

    switch (classification) {
      case 'expected':
        console.log(`ℹ️ [${context}] Expected: ${message}`);
        break;
      case 'info':
        console.log(`ℹ️ [${context}] Info: ${message}`);
        break;
      case 'warning':
        console.warn(`⚠️ [${context}] Warning: ${message}`);
        break;
      case 'critical':
        console.error(`❌ [${context}] Critical: ${message}`);
        break;
    }
  }
}
