import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-55ec1098`;

export async function checkAPIHealth(): Promise<{
  status: 'online' | 'offline' | 'error';
  message: string;
  details?: any;
}> {
  try {
    console.log('Checking API health at:', `${API_BASE}/health`);
    
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });

    if (!response.ok) {
      return {
        status: 'error',
        message: `API returned ${response.status}: ${response.statusText}`,
        details: { status: response.status, statusText: response.statusText }
      };
    }

    const data = await response.json();
    return {
      status: 'online',
      message: 'API is online and responding',
      details: data
    };
  } catch (error: any) {
    console.error('API Health Check Error:', error);
    
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      return {
        status: 'offline',
        message: 'Cannot connect to API - network error or CORS issue',
        details: { error: error.message }
      };
    }
    
    return {
      status: 'error',
      message: `API health check failed: ${error.message}`,
      details: { error: error.message }
    };
  }
}

export async function initializeAPI(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    console.log('Initializing API database...');
    
    const response = await fetch(`${API_BASE}/init-database`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: `Database initialization failed: ${response.status} ${response.statusText}`,
        details: errorData
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: 'Database initialized successfully',
      details: data
    };
  } catch (error: any) {
    console.error('API Initialize Error:', error);
    return {
      success: false,
      message: `Database initialization failed: ${error.message}`,
      details: { error: error.message }
    };
  }
}

export async function initializeAdmin(): Promise<{
  success: boolean;
  message: string;
  credentials?: any;
  details?: any;
}> {
  try {
    console.log('Initializing admin user...');
    
    const response = await fetch(`${API_BASE}/init-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: `Admin initialization failed: ${response.status} ${response.statusText}`,
        details: errorData
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || 'Admin user initialized successfully',
      credentials: data.credentials,
      details: data
    };
  } catch (error: any) {
    console.error('Admin Initialize Error:', error);
    return {
      success: false,
      message: `Admin initialization failed: ${error.message}`,
      details: { error: error.message }
    };
  }
}
