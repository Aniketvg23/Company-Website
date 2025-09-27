import { useState, useEffect } from "react";
import { SimpleAdminHeader } from "../components/SimpleAdminHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Plus, Edit, Trash2, Save, X, Package, CheckCircle } from "lucide-react";
import { useRealtimeData } from "../contexts/RealtimeDataContext";
import { SystemModeIndicator } from "../components/SystemModeIndicator";
import { PermissionErrorHandler } from "../components/PermissionErrorHandler";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  features: string[];
  status: 'active' | 'inactive';
}

export function SimpleAdminProducts() {
  const { 
    products, 
    loading: globalLoading, 
    error: globalError, 
    isBackendAvailable,
    createProduct, 
    updateProduct, 
    deleteProduct,
    refreshData
  } = useRealtimeData();
  
  const [isLoading, setIsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Sample products data
  const sampleProducts: Product[] = [
    {
      id: "1",
      name: "HDPE Carry Bags",
      description: "High-density polyethylene carry bags perfect for retail and grocery stores. Available in various sizes with excellent strength and durability.",
      category: "Retail Bags",
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop",
      features: ["Eco-friendly", "Tear resistant", "Multiple sizes", "Custom printing available"],
      status: "active"
    },
    {
      id: "2",
      name: "LDPE Packaging Films",
      description: "Low-density polyethylene films ideal for food packaging and industrial applications. Provides excellent moisture barrier properties.",
      category: "Industrial Films",
      imageUrl: "https://images.unsplash.com/photo-1586953235919-d4e7fac1bd0b?w=300&h=200&fit=crop",
      features: ["Food grade", "Moisture barrier", "Flexible", "Heat sealable"],
      status: "active"
    },
    {
      id: "3",
      name: "Biodegradable Shopping Bags",
      description: "Environmentally friendly shopping bags made from biodegradable materials. Perfect for eco-conscious businesses.",
      category: "Eco-Friendly",
      imageUrl: "https://images.unsplash.com/photo-1615719413546-198b25453f85?w=300&h=200&fit=crop",
      features: ["100% biodegradable", "Compostable", "Strong handles", "Custom branding"],
      status: "active"
    }
  ];

  // Clear local error when global data updates
  useEffect(() => {
    if (globalError) {
      setError(globalError);
    } else {
      setError("");
    }
  }, [globalError]);

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: "",
      description: "",
      category: "",
      imageUrl: "",
      features: [],
      status: "active"
    };
    setEditingProduct(newProduct);
    setIsAddingNew(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
    setIsAddingNew(false);
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) return;

    if (!editingProduct.name.trim() || !editingProduct.description.trim()) {
      setError("Name and description are required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (isAddingNew) {
        await createProduct(editingProduct);
        setSuccess("Product added successfully!");
      } else {
        await updateProduct(editingProduct.id, editingProduct);
        setSuccess("Product updated successfully!");
      }

      setEditingProduct(null);
      setIsAddingNew(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      // Use the actual error message which will include permission guidance
      setError(err.message || "Failed to save product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setIsLoading(true);
      try {
        await deleteProduct(productId);
        setSuccess("Product deleted successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } catch (err: any) {
        // Use the actual error message which will include permission guidance
        setError(err.message || "Failed to delete product");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setIsAddingNew(false);
    setError("");
  };

  const updateEditingProduct = (field: keyof Product, value: any) => {
    if (!editingProduct) return;
    setEditingProduct({ ...editingProduct, [field]: value });
  };

  const addFeature = () => {
    if (!editingProduct) return;
    updateEditingProduct('features', [...editingProduct.features, ""]);
  };

  const updateFeature = (index: number, value: string) => {
    if (!editingProduct) return;
    const newFeatures = [...editingProduct.features];
    newFeatures[index] = value;
    updateEditingProduct('features', newFeatures);
  };

  const removeFeature = (index: number) => {
    if (!editingProduct) return;
    const newFeatures = editingProduct.features.filter((_, i) => i !== index);
    updateEditingProduct('features', newFeatures);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleAdminHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Mode Status */}
        <div className="mb-6 p-3 bg-gray-50 rounded-lg border">
          <SystemModeIndicator />
          {globalLoading && (
            <div className="text-sm text-gray-600 mt-2">Syncing data...</div>
          )}
          {!isBackendAvailable && (
            <div className="text-xs text-gray-500 mt-2">
              💡 Changes are saved locally. Start the Supabase server to enable real-time features and permanent storage.
            </div>
          )}
        </div>

        {/* Permission Error Handler */}
        <PermissionErrorHandler 
          error={error || globalError} 
          operation="creating, updating, or deleting products"
          onDismiss={() => setError("")}
        />
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600 mt-2">Manage your product catalog</p>
          </div>
          <Button onClick={handleAddProduct} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Product
          </Button>
        </div>

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Edit Form */}
        {editingProduct && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{isAddingNew ? 'Add New Product' : 'Edit Product'}</CardTitle>
              <CardDescription>
                Fill in the product details below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={editingProduct.name}
                    onChange={(e) => updateEditingProduct('name', e.target.value)}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={editingProduct.category}
                    onChange={(e) => updateEditingProduct('category', e.target.value)}
                    placeholder="Enter category"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={editingProduct.description}
                  onChange={(e) => updateEditingProduct('description', e.target.value)}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={editingProduct.imageUrl}
                  onChange={(e) => updateEditingProduct('imageUrl', e.target.value)}
                  placeholder="Enter image URL"
                />
              </div>

              <div className="space-y-2">
                <Label>Features</Label>
                {editingProduct.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="Enter feature"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFeature(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addFeature}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Feature
                </Button>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveProduct} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Product'}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Debug Info - Shows what data we're working with */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">🐛 Debug Info</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Total products:</strong> {products.length}</p>
            <p><strong>Backend available:</strong> {isBackendAvailable ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Loading:</strong> {globalLoading ? '⏳ Yes' : '✅ No'}</p>
            <p><strong>Error:</strong> {globalError || 'None'}</p>
            {products.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer font-medium">Product IDs & Sources</summary>
                <ul className="mt-1 ml-4 space-y-1">
                  {products.map((p, index) => (
                    <li key={p.id} className="text-xs">
                      {index + 1}. ID: {p.id} | Name: {p.name} | 
                      Source: {p.id?.toString().length < 5 ? '🔢 Sample Data' : '🔥 Firebase'}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <Badge 
                  className={`absolute top-2 right-2 ${
                    product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {product.status}
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{product.description}</p>
                  
                  {product.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {product.features.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{product.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditProduct(product)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first product</p>
              <Button onClick={handleAddProduct}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Product
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
