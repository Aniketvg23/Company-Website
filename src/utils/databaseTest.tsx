import { projectId, publicAnonKey } from './supabase/info';

export async function testDatabaseConnection() {
  try {
    console.log('🔄 Testing database connection...');
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-55ec1098/health`);
    
    if (response.ok) {
      console.log('✅ Database server is running and accessible');
      return true;
    } else {
      console.log('❌ Database server health check failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Database connection failed:', error);
    return false;
  }
}

export async function initializeAdminUser() {
  try {
    console.log('👤 Creating admin user...');
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-55ec1098/init-admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Admin user ready:', data.message);
      return true;
    } else {
      console.log('❌ Admin user creation failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Admin user creation error:', error);
    return false;
  }
}

export async function initializeSampleData() {
  try {
    console.log('📊 Initializing sample data...');
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-55ec1098/init-database`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Sample data initialized:', data);
      return true;
    } else {
      console.log('❌ Sample data initialization failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Sample data initialization error:', error);
    return false;
  }
}

export async function runFullDatabaseSetup() {
  console.log('🚀 Starting full database setup...');
  
  const connectionOk = await testDatabaseConnection();
  if (!connectionOk) {
    console.log('❌ Cannot proceed without database connection');
    return false;
  }
  
  // Skip Firebase admin user initialization - using localStorage auth
  console.log('👤 Skipping Firebase admin user (using localStorage auth)');
  const adminOk = true; // Always true since we're using localStorage auth
  const dataOk = await initializeSampleData();
  
  if (adminOk && dataOk) {
    console.log('🎉 Database setup completed successfully!');
    console.log('📝 Admin credentials: admin@cartify.com / CartifyAdmin2024!');
    console.log('🌐 Access admin dashboard: /admin/login');
    return true;
  } else {
    console.log('❌ Database setup incomplete');
    return false;
  }
}

// Auto-run on import in development
if (typeof window !== 'undefined' && import.meta.env?.DEV) {
  console.log('🔄 Auto-testing database setup...');
  testDatabaseConnection();
}
