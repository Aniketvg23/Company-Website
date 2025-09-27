import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Cloud, HardDrive, CheckCircle, AlertTriangle } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface SystemStatusProps {
  className?: string;
  compact?: boolean;
}

export function SystemStatus({ className = '', compact = false }: SystemStatusProps) {
  const [serverStatus, setServerStatus] = useState<'checking' | 'connected' | 'offline'>('checking');
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    try {
      // Check local storage products
      const storedProducts = localStorage.getItem('cartify_products');
      if (storedProducts) {
        const products = JSON.parse(storedProducts);
        setProductCount(products.filter((p: any) => p && p.status === 'active').length);
      }

      // Check server connectivity
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-aa812cee/health`, {
        signal: AbortSignal.timeout(2000)
      });
      
      if (response.ok) {
        setServerStatus('connected');
      } else {
        setServerStatus('offline');
      }
    } catch (error) {
      setServerStatus('offline');
    }
  };

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {serverStatus === 'connected' ? (
          <Badge variant="outline" className="text-green-600">
            <Cloud className="w-3 h-3 mr-1" />
            Online
          </Badge>
        ) : (
          <Badge variant="outline" className="text-orange-600">
            <HardDrive className="w-3 h-3 mr-1" />
            Demo Mode
          </Badge>
        )}
        {productCount > 0 && (
          <Badge variant="secondary">
            {productCount} Products
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {serverStatus === 'checking' ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                <span className="text-sm text-muted-foreground">Checking system status...</span>
              </>
            ) : serverStatus === 'connected' ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Server Online</p>
                  <p className="text-xs text-muted-foreground">Connected to cloud database</p>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Demo Mode</p>
                  <p className="text-xs text-muted-foreground">Using local storage for data</p>
                </div>
              </>
            )}
          </div>
          
          <div className="text-right">
            <p className="text-sm font-medium">{productCount} Products</p>
            <p className="text-xs text-muted-foreground">
              {serverStatus === 'connected' ? 'Cloud + Local' : 'Local Storage'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
