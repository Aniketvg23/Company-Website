import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { Package, Plus, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { initializeProductsInDatabase, initializeProductsInLocalStorage, clearAllProducts, quickInitProducts } from "../utils/initializeProducts";

export function InitializeProducts() {
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleInitializeDatabase = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const result = await initializeProductsInDatabase();
      setResult(result);
    } catch (error) {
      setResult({ 
        success: false, 
        message: 'Failed to initialize products',
        error: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeLocalStorage = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const result = await initializeProductsInLocalStorage();
      setResult(result);
    } catch (error) {
      setResult({ 
        success: false, 
        message: 'Failed to initialize products in local storage',
        error: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickInit = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const result = await quickInitProducts();
      setResult(result);
    } catch (error) {
      setResult({ 
        success: false, 
        message: 'Failed to quick initialize products',
        error: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearProducts = async () => {
    if (!confirm('Are you sure you want to clear all products from local storage?')) {
      return;
    }
    
    setClearing(true);
    setResult(null);
    
    try {
      const result = await clearAllProducts();
      setResult(result);
    } catch (error) {
      setResult({ 
        success: false, 
        message: 'Failed to clear products',
        error: error.message 
      });
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Package className="w-8 h-8 text-primary" />
              <h1 className="text-xl font-semibold text-foreground">Product Database Initialization</h1>
            </div>
            <Badge variant="outline">Admin Tool</Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Initialize Cartify Products Database</CardTitle>
              <CardDescription>
                This tool helps you populate the product database with comprehensive sample products for Cartify Automotive Industries. 
                Choose your initialization method based on your current setup.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The initialization will add 6 comprehensive products including:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span>Heavy-Duty Industrial Bags</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span>Eco-Friendly Biodegradable Bags</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span>Food-Grade Storage Bags</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span>Automotive Parts Packaging</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span>Custom Printed Branding Bags</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span>Vacuum Seal Barrier Bags</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-primary" />
                  <span>Database Initialization</span>
                </CardTitle>
                <CardDescription>
                  Initialize products in the Supabase database. This will attempt to use the server-side storage first.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleInitializeDatabase}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2"></div>
                      Initializing...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Initialize Database
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-green-600" />
                  <span>Quick Initialize</span>
                </CardTitle>
                <CardDescription>
                  Fast initialization using local storage with automatic server sync when available.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleQuickInit}
                  disabled={loading}
                  className="w-full"
                  variant="default"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2"></div>
                      Initializing...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Quick Initialize
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-orange-600" />
                  <span>Local Storage Only</span>
                </CardTitle>
                <CardDescription>
                  Initialize products directly in local storage. Use this if the server is unavailable.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleInitializeLocalStorage}
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent mr-2"></div>
                      Initializing...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Initialize Local Storage
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Clear Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-destructive">
                <Trash2 className="w-5 h-5" />
                <span>Clear Products</span>
              </CardTitle>
              <CardDescription>
                Clear all products from local storage. Note: This only affects local storage, not the server database.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleClearProducts}
                disabled={clearing}
                variant="destructive"
                className="w-full sm:w-auto"
              >
                {clearing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-destructive-foreground border-t-transparent mr-2"></div>
                    Clearing...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Local Storage
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              <div className="flex items-start space-x-2">
                {result.success ? (
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
                )}
                <div className="space-y-1">
                  <AlertDescription className="font-medium">
                    {result.message}
                  </AlertDescription>
                  {result.count && (
                    <AlertDescription className="text-sm">
                      Total products: {result.count}
                    </AlertDescription>
                  )}
                  {result.error && (
                    <AlertDescription className="text-sm text-destructive">
                      Error: {result.error}
                    </AlertDescription>
                  )}
                </div>
              </div>
            </Alert>
          )}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">1</div>
                  <span>After initialization, visit the <a href="/admin/products" className="text-primary hover:underline">Admin Products</a> page to manage your products</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">2</div>
                  <span>Check the <a href="/services" className="text-primary hover:underline">Services</a> page to see how products are displayed to visitors</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">3</div>
                  <span>You can edit, add, or remove products through the admin dashboard</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
