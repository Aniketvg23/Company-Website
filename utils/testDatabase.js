// Simple database testing utility
export async function testDatabaseConnection() {
  try {
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-aa812cee/health`);
    if (response.ok) {
      console.log('✅ Database server is running');
      return true;
    } else {
      console.log('❌ Database server health check failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Database connection failed:', error);
    return false;
  }
}

export async function initializeFullDatabase() {
  try {
    console.log('🚀 Starting full database initialization...');
    
    // 1. Create admin user
    console.log('📝 Creating admin user...');
    const adminResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-aa812cee/init-admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (adminResponse.ok) {
      const adminData = await adminResponse.json();
      console.log('✅ Admin user:', adminData.message);
    }
    
    // 2. Initialize database with sample data
    console.log('📊 Initializing database with sample data...');
    const initResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-aa812cee/init-database`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (initResponse.ok) {
      const initData = await initResponse.json();
      console.log('✅ Database initialized:', initData);
      return true;
    } else {
      console.log('❌ Database initialization failed');
      return false;
    }
    
  } catch (error) {
    console.log('❌ Full database initialization failed:', error);
    return false;
  }
}

// Auto-run on import in development
if (typeof window !== 'undefined') {
  console.log('🔄 Testing database connection...');
  testDatabaseConnection();
}
